import React, { useState } from 'react'

export default function ProductForm({ onSubmit }){
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('electronics')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    if(!title || !price) {
      alert('Title and price are required')
      return
    }
    const payload = {
      title, price: parseFloat(price), description, image: image || 'https://via.placeholder.com/150', category
    }
    setLoading(true)
    const ok = await onSubmit(payload)
    setLoading(false)
    if(ok){
      setTitle(''); setPrice(''); setDescription(''); setImage(''); setCategory('electronics')
      alert('Product added (mock).')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div>
          <label className="form-label">Title</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Price</label>
          <input className="input" value={price} onChange={e=>setPrice(e.target.value)} />
        </div>
      </div>

      <div style={{marginTop:8}}>
        <label className="form-label">Category</label>
        <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="electronics">electronics</option>
          <option value="jewelery">jewelery</option>
          <option value="men's clothing">men's clothing</option>
          <option value="women's clothing">women's clothing</option>
        </select>
      </div>

      <div style={{marginTop:8}}>
        <label className="form-label">Image URL (optional)</label>
        <input className="input" value={image} onChange={e=>setImage(e.target.value)} />
      </div>

      <div style={{marginTop:8}}>
        <label className="form-label">Description</label>
        <textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} rows={4} />
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
        <button className="btn btn-success" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
      </div>
    </form>
  )
}
