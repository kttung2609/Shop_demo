import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BreadCrums from '../Components/BreadCrums/BreadCrums'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'

const Product = () => {

  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/products/${id}`)
        const data = await res.json()

        console.log("DETAIL:", data)

        if (data) {
          setProduct(data)
        }

      } catch (err) {
        console.error("Lỗi fetch product:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()

  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>
  }

  return (
    <div>
      <BreadCrums product={product} />
      <ProductDisplay product={product} />
    </div>
  )
}

export default Product