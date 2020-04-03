import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { readSingleProductFromApi, listRealted } from './apiCore'
import Card from './Card'

const Product = props => {

    const [product, setProduct] = useState({})
    const [error, setError] = useState(false)
    const [realtedProducts, setRelatedProducts] = useState([])

    const loadSingleProductById = (productId) => {
        readSingleProductFromApi(productId).then(data => {
            if (data.error) {
                setError(data.error)
            }
            else {
                setProduct(data)
                //if the rpoduct is got then find related products
                listRealted(data._id).then(result => {
                    if (result.error) {
                        setError(result.error)
                    }
                    else {
                        setRelatedProducts(result)
                    }
                })
            }
        })
    }


    //use effect was earlier running only first time and on changing the state so the related products are not 
    //showing when we click on the view more button of related products but the query string is changing when we
    //click that button
    //so we want whenever  the query string changes useEffect should run
    //so useEffect should depend on "props"
    useEffect(() => {
        //get the product id from the url 
        const productId = props.match.params.productId
        loadSingleProductById(productId)
    }, [props])

    return (
        <Layout title={product && product.name} description={product && product.description && product.description.substring(0, 100)} className="container-fluid">

            <div className="row">
                <div className="col-8">
                    {product && product.description && <Card product={product} showViewProductButton={false} />}
                </div>
                <div className="col-4">
                    <h3>Realted Products</h3>
                    {
                        realtedProducts.map((p, i) => (
                            <div key={i} className="mb-3" >
                                <Card product={p} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </Layout>
    )
}

export default Product