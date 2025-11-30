import React, { useEffect, useState } from 'react'
import api from './api'
import ProductForm from './components/ProductForm'
import EditModal from './components/EditModal'
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

export default function App(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(()=>{
    fetchCategories()
    fetchProducts()
  },[])

  async function fetchCategories(){
    try{
      const res = await api.get('/products/categories')
      setCategories(res.data)
    }catch(err){
      console.error('categories', err)
    }
  }

  async function fetchProducts(){
    try{
      setLoading(true)
      const url = category ? `/products/category/${encodeURIComponent(category)}` : '/products'
      const res = await api.get(url)
      setProducts(res.data)
    }catch(err){
      console.error(err)
      alert('Failed to fetch products')
    }finally{
      setLoading(false)
    }
  }

  async function addProduct(payload){
    try{
      const temp = { ...payload, id: 'temp-' + Date.now() }
      setProducts(prev => [temp, ...prev])
      const res = await api.post('/products', payload)
      setProducts(prev => prev.map(p => p.id === temp.id ? res.data : p))
      return true
    }catch(err){
      console.error(err)
      alert('Failed to add product')
      return false
    }
  }

  async function updateProduct(id, payload){
    try{
      const res = await api.put(`/products/${id}`, payload)
      setProducts(prev => prev.map(p => p.id === id ? res.data : p))
      return true
    }catch(err){
      console.error(err)
      alert('Failed to update product')
      return false
    }
  }

  async function deleteProduct(id){
    if(!window.confirm('Delete this product?')) return
    try{
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
    }catch(err){
      console.error(err)
      alert('Failed to delete product')
    }
  }

  const filtered = products.filter(p => {
    const q = query.toLowerCase().trim()
    if(!q) return true
    return (p.title || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)
  })

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 style={{margin:0}}>Product Management Dashboard</h1>
        </div>
        <div className="controls">
          <input style={{minWidth:'160px'}} className="input" placeholder="Search title or Category..." value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="input" value={category} onChange={e=>{setCategory(e.target.value)}} >
            <option value="">All categories</option>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-success" onClick={fetchProducts}>Refresh</button>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div style={{marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center', textTransform:'uppercase'}}>
            <strong>Products {loading ? '(loading...)' : `(${products.length})`}</strong>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th className="small">Category</th>
                <th className="small">Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id}>
                  <td><img src={p.image} alt="" className="img-thumb" /></td>
                  <td style={{maxWidth:380}}>{p.title}</td>
                  <td className="small">{p.category}</td>
                  <td className="small">₹{p.price}</td>
                  <td>
                    <button className="btn btn-sm d-md-block" onClick={()=>setEditingProduct(p)}>Edit</button>{' '}
                    <button className="btn btn-danger btn-sm d-md-block" onClick={()=>deleteProduct(p.id)}>Delete</button>
                    <div className="d-md-none user-icon" onClick={()=>setEditingProduct(p)}><FiEdit /></div>{' '}
                    <div className="d-md-none user-icon" onClick={()=>deleteProduct(p.id)}><MdDeleteOutline /></div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={5} className="small">No products found.</td></tr>}
            </tbody>
          </table>
        </div>

        <div>
          <div className="card" style={{marginBottom:12}}>
            <h3 style={{marginTop:0}}>Add New Product</h3>
            <ProductForm onSubmit={addProduct} />
          </div>

          <div className="card">
            <h4 style={{marginTop:0}}>Quick Filters</h4>
            <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
              <button className="btn btn-sm" onClick={()=>{setCategory('electronics'); fetchProducts();}}>Electronics</button>
              <button className="btn btn-sm" onClick={()=>{setCategory('jewelery'); fetchProducts();}}>Jewelery</button>
              <button className="btn btn-sm" onClick={()=>{setCategory("men's clothing"); fetchProducts();}}>Men's clothing</button>
              <button className="btn btn-sm" onClick={()=>{setCategory("women's clothing"); fetchProducts();}}>Women's clothing</button>
              <button className="btn btn-sm" onClick={()=>{setCategory(''); fetchProducts();}}>All</button>
            </div>
          </div>
        </div>
      </div>

      {editingProduct && (
        <EditModal product={editingProduct} onClose={()=>setEditingProduct(null)} onSave={updateProduct} />
      )}

    </div>
  )
}
