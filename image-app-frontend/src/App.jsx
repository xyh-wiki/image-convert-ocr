import React, { useState } from 'react'

/**
 * @Author: XYH
 * @Date: 2025-11-12
 * @Description: 前端页面（React + Vite）—— 上传、目标格式、OCR、历史展示
 */
export default function App() {
  const [targetFormat, setTargetFormat] = useState('png')
  const [enableOcr, setEnableOcr] = useState(true)
  const [file, setFile] = useState(null)
  const [history, setHistory] = useState([])

  const handleSubmit = async () => {
    if (!file) return alert('请选择文件')
    const form = new FormData()
    form.append('file', file)
    form.append('targetFormat', targetFormat)
    form.append('ocr', String(enableOcr))
    const resp = await fetch('/api/image/convert', { method:'POST', body: form })
    if (!resp.ok) return alert('处理失败')
    const data = await resp.json()
    if (data.ocrText) setHistory(prev => [{time: new Date().toLocaleString(), text: data.ocrText}, ...prev])
    if (data.base64 && data.filename) {
      const a = document.createElement('a')
      a.href = 'data:' + (data.contentType||'application/octet-stream') + ';base64,' + data.base64
      a.download = data.filename
      document.body.appendChild(a); a.click(); a.remove()
    }
  }

  return (
    <div style={{maxWidth: '1100px', margin: '0 auto', padding: 16}}>
      <h1>图片格式转换 & OCR</h1>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:16}}>
        <section className="card">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
            <div className="card">
              <p style={{opacity:.8, fontSize:12}}>选择图片</p>
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="input"/>
              {file && <p style={{opacity:.7, fontSize:12, marginTop:8}}>已选择：{file.name}</p>}
            </div>
            <div className="card">
              <p style={{opacity:.8, fontSize:12}}>目标格式</p>
              <select className="select" value={targetFormat} onChange={e=>setTargetFormat(e.target.value)}>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
                <option value="tiff">TIFF</option>
                <option value="bmp">BMP</option>
                <option value="gif">GIF</option>
                <option value="psd">PSD</option>
              </select>
              <label style={{display:'flex', gap:8, alignItems:'center', marginTop:12, fontSize:14}}>
                <input type="checkbox" checked={enableOcr} onChange={e=>setEnableOcr(e.target.checked)}/>
                同时进行 OCR 识别
              </label>
              <button className="btn" style={{width:'100%', marginTop:12}} onClick={handleSubmit}>开始处理</button>
            </div>
          </div>
        </section>
        <aside className="card" style={{height:'calc(100vh - 160px)', overflow:'auto'}}>
          <p style={{opacity:.8, fontSize:12}}>OCR 历史</p>
          {history.length===0 && <p style={{opacity:.6, fontSize:12}}>暂无历史记录</p>}
          <ul style={{display:'grid', gap:8}}>
            {history.map((h,i)=> (
              <li key={i} className="card">
                <p style={{opacity:.6, fontSize:12}}>{h.time}</p>
                <pre style={{whiteSpace:'pre-wrap'}}>{h.text}</pre>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div style={{marginTop:24}}>
        <ins className="adsbygoogle"
          style={{display:'block'}}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>
      </div>
    </div>
  )
}
