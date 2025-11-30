import React, { useState } from 'react'

export default function EditModal({ product, onClose, onSave }){
  const [title, setTitle] = useState(product.title || '')
  const [price, setPrice] = useState(product.price || 0)
  const [description, setDescription] = useState(product.description || '')
  const [image, setImage] = useState(product.image || '')
  const [category, setCategory] = useState(product.category || '')
  const [loading, setLoading] = useState(false)

  async function handleSave(){
    setLoading(true)
    const payload = { title, price: parseFloat(price), description, image, category }
    const ok = await onSave(product.id, payload)
    setLoading(false)
    if(ok) onClose()
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>Edit Product</h3>
        <div className="form-row">
          <div style={{flex:1}}>
            <label className="form-label">Title</label>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div style={{width:120}}>
            <label className="form-label">Price</label>
            <input className="input" value={price} onChange={e=>setPrice(e.target.value)} />
          </div>
        </div>

        <div style={{marginTop:8}}>
          <label className="form-label">Category</label>
          <input className="input" value={category} onChange={e=>setCategory(e.target.value)} />
        </div>

        <div style={{marginTop:8}}>
          <label className="form-label">Image URL</label>
          <input className="input" value={image} onChange={e=>setImage(e.target.value)} />
        </div>

        <div style={{marginTop:8}}>
          <label className="form-label">Description</label>
          <textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} rows={3} />
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}
