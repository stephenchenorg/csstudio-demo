// ============================================================================
//  T-shirt Designer — 純前端「畫圖 → 貼到 3D 衣服」demo
// ----------------------------------------------------------------------------
//  核心技術（就是客製化戒指/衣服網站那一套）：
//    1. 左邊用 HTML5 Canvas 2D 畫圖
//    2. 把那個 <canvas> 用 THREE.CanvasTexture() 包成「貼圖」
//    3. 把貼圖貼到 3D 衣服的胸口（用 DecalGeometry 投影一塊印花）
//    4. 每次畫筆有更新，就 texture.needsUpdate = true → 3D 即時同步
//    5. OrbitControls 讓相機繞著衣服轉 = 使用者「旋轉衣服」
//  沒有後端、沒有建置流程，一份 HTML + JS 就跑得起來。
// ============================================================================

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js'

// ────────────────────────────────────────────────────────────────────────────
//  Part 1：繪圖畫布（HTML5 Canvas 2D）
// ────────────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('draw')
const ctx = canvas.getContext('2d')

// 畫布「內部解析度」— 這才是實際貼到衣服上的像素尺寸（跟畫面上的 CSS 大小無關）
canvas.width = 512
canvas.height = 512
ctx.lineCap = 'round'
ctx.lineJoin = 'round'

// 注意：畫布「清空」用的是 clearRect（透明），不是填白。
// 這樣沒畫到的地方 = 透明 = 直接露出衣服布料（像真的印花）。
// 使用者看到的白底是 CSS 給 <canvas> 的背景色，不影響像素的透明度。
let brushColor = '#e5322d'
let brushSize = 16
let erasing = false
let drawing = false
let last = null

// 把滑鼠/觸控座標換算成畫布內部座標
function getPos (e) {
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  return {
    x: (clientX - rect.left) / rect.width * canvas.width,
    y: (clientY - rect.top) / rect.height * canvas.height,
  }
}

function strokeStart (e) {
  drawing = true
  last = getPos(e)
  strokeMove(e) // 讓「點一下」也能畫出一個點
}

function strokeMove (e) {
  if (!drawing) return
  e.preventDefault()
  const p = getPos(e)
  // 橡皮擦 = destination-out（把畫過的地方擦回透明）
  ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over'
  ctx.strokeStyle = brushColor
  ctx.lineWidth = brushSize
  ctx.beginPath()
  ctx.moveTo(last.x, last.y)
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
  last = p
  // ★★ 關鍵：告訴 Three.js「貼圖內容變了，下次 render 請重新上傳到 GPU」
  if (texture) texture.needsUpdate = true
}

function strokeEnd () {
  drawing = false
  last = null
}

canvas.addEventListener('mousedown', strokeStart)
canvas.addEventListener('mousemove', strokeMove)
window.addEventListener('mouseup', strokeEnd)
canvas.addEventListener('touchstart', strokeStart, { passive: false })
canvas.addEventListener('touchmove', strokeMove, { passive: false })
window.addEventListener('touchend', strokeEnd)

// ── 工具列控制 ──────────────────────────────────────────────
const colorInput = document.getElementById('color')
const sizeInput = document.getElementById('size')
const eraserBtn = document.getElementById('eraser')
const clearBtn = document.getElementById('clear')

colorInput.addEventListener('input', (e) => {
  brushColor = e.target.value
  erasing = false
  eraserBtn.classList.remove('active')
})
sizeInput.addEventListener('input', (e) => { brushSize = Number(e.target.value) })
eraserBtn.addEventListener('click', () => {
  erasing = !erasing
  eraserBtn.classList.toggle('active', erasing)
})
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (texture) texture.needsUpdate = true
})

// ────────────────────────────────────────────────────────────────────────────
//  Part 2：3D 場景（Three.js）
// ────────────────────────────────────────────────────────────────────────────
const stage = document.getElementById('stage')

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
stage.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100)

// 燈光：讓布料有立體陰影
scene.add(new THREE.AmbientLight(0xffffff, 1.1))
const hemi = new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.0)
scene.add(hemi)
const dir = new THREE.DirectionalLight(0xffffff, 1.4)
dir.position.set(2, 3, 4)
scene.add(dir)

// OrbitControls：拖曳 = 相機繞著衣服轉（也就是使用者感覺到的「旋轉衣服」）
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false
controls.autoRotate = false
controls.autoRotateSpeed = 2.0

// 自動旋轉開關
document.getElementById('autorotate').addEventListener('change', (e) => {
  controls.autoRotate = e.target.checked
})

// 這張就是「把畫布包成貼圖」的物件 —— Part 1 的畫布資料會流進這裡
let texture = null
let shirtMesh = null

// ── 載入 T-shirt 3D 模型（.glb）─────────────────────────────
const loadingEl = document.getElementById('loading')
const loader = new GLTFLoader()
loader.load(
  './models/shirt.glb',
  (gltf) => {
    scene.add(gltf.scene)

    // 找出衣服本體：優先用名字含 shirt/T_Shirt 的 mesh，否則挑頂點最多的那個
    let best = null
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return
      const named = /shirt/i.test(o.name)
      const count = o.geometry?.attributes?.position?.count || 0
      if (named) { best = o; return }
      if (!best || count > (best.geometry?.attributes?.position?.count || 0)) best = o
    })
    shirtMesh = best

    // 讓衣服本體顏色白一點，當作乾淨的白 T（保留原本的陰影明暗）
    if (shirtMesh?.material) {
      shirtMesh.material.color = new THREE.Color('#f4f4f4')
      shirtMesh.material.roughness = 0.85
      shirtMesh.material.metalness = 0.0
    }

    frameCamera()      // 相機對準衣服
    buildDecal()       // 在胸口貼上「畫布印花」

    loadingEl.style.display = 'none'
  },
  undefined,
  (err) => {
    console.error(err)
    loadingEl.textContent = '模型載入失敗，請看 console'
  },
)

// 依模型大小把相機擺到正面適當距離
function frameCamera () {
  const box = new THREE.Box3().setFromObject(shirtMesh)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)

  controls.target.copy(center)
  camera.position.set(center.x, center.y, center.z + maxDim * 2.4)
  camera.near = maxDim / 100
  camera.far = maxDim * 100
  camera.updateProjectionMatrix()
  controls.update()
}

// ────────────────────────────────────────────────────────────────────────────
//  Part 3：把畫布貼到衣服胸口（DecalGeometry 投影一塊印花）
// ----------------------------------------------------------------------------
//  DecalGeometry 的原理：從一個位置、朝一個方向，往衣服 mesh 表面「投影」出
//  一塊貼片幾何（會服貼在布料的起伏上），並自動產生 0~1 的 UV，
//  於是整張畫布剛好對應到這塊胸口貼片。
// ────────────────────────────────────────────────────────────────────────────
function buildDecal () {
  shirtMesh.updateWorldMatrix(true, true)

  const box = new THREE.Box3().setFromObject(shirtMesh)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())

  // 投影位置：衣服正面（+z 那一面）、稍微偏上 = 胸口
  const position = new THREE.Vector3(center.x, center.y + size.y * 0.06, box.max.z)
  // 朝向：面向 +z（正對觀看者的那一面）
  const orientation = new THREE.Euler(0, 0, 0)
  // 印花大小（正方形），深度給大一點確保能包住布料起伏
  const edge = Math.min(size.x, size.y) * 0.5
  const decalSize = new THREE.Vector3(edge, edge, Math.max(size.z, edge))

  const decalGeo = new DecalGeometry(shirtMesh, position, orientation, decalSize)

  // 用畫布當貼圖。transparent + depthWrite:false + polygonOffset 是印花貼片的標準設定，
  // 讓它服貼疊在衣服表面、不會 z-fighting 閃爍。
  texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

  const decalMat = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    roughness: 0.7,
  })

  const decalMesh = new THREE.Mesh(decalGeo, decalMat)
  // DecalGeometry 產出的是「世界座標」，直接加到 scene；OrbitControls 轉的是相機，
  // 所以貼片會一直乖乖貼在衣服上。
  scene.add(decalMesh)
}

// ────────────────────────────────────────────────────────────────────────────
//  Part 4：render loop + 視窗縮放
// ────────────────────────────────────────────────────────────────────────────
function resize () {
  const w = stage.clientWidth
  const h = stage.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()

function animate () {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()
