import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import Card from './Card'
import { getAllCategories, getFilteredProducts } from './apiCore'
import Checkbox from './Checkbox'
import { Prices } from './fixedPrices'
import RadioBox from './RadioBox'

const Shop = () => {

    const [categories, setCategories] = useState([])
    const [error, setError] = useState(false)
    const [limit, setLimit] = useState(6)
    const [skip, setSkip] = useState(0)
    const [size, setSize] = useState(0)
    const [filteredResult, setFilteredResult] = useState([])
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] }
    })


    //load categories and set form data
    const init = () => {
        getAllCategories().then(data => {
            if (data.error) {
                setError(data.error)
            }
            else {
                setCategories(data)
            }
        })
    }

    const loadFilteredResults = (SearchFilters) => {
        //console.log(SearchFilters)
        getFilteredProducts(skip, limit, SearchFilters).then(data => {
            if (data.error) {
                setError(data.error)
            }
            else {
                setFilteredResult(data.data)
                setSize(data.size)
                setSkip(0)
            }
        })
    }


    const loadMore = () => {

        let toSkip = skip + limit

        getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {
            if (data.error) {
                setError(data.error)
            }
            else {
                setFilteredResult([...filteredResult, ...data.data])
                setSize(data.size)
                setSkip(toSkip)
            }
        })
    }

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5" >Load More</button>
            )
        )
    }

    useEffect(() => {
        init()
        loadFilteredResults(skip, limit, myFilters.filters)
    }, [])

    const handleFilters = (filters, filterBy) => {
        //console.log(filters, filterBy)
        const newFilters = { ...myFilters }
        newFilters.filters[filterBy] = filters

        if (filterBy == "price") {
            let priceValues = handlePrice(filters)
            newFilters.filters[filterBy] = priceValues
        }
        loadFilteredResults(myFilters.filters)
        setMyFilters(newFilters)
    }

    const handlePrice = value => {
        const data = Prices
        let array = []
        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array
            }
        }
        return array
    }


    return (
        <Layout title="Shop Page" description="Search ad find books of your choice!" className="container-fluid">

            <div className="row">
                <div className="col-4">
                    <h4>Filter By Categories</h4>
                    <ul>
                        <Checkbox categories={categories}
                            handleFilters={filters => handleFilters(filters, "category")} />
                    </ul>
                    <h4>Filter By Price Range</h4>
                    <ul>
                        <RadioBox prices={Prices}
                            handleFilters={filters => handleFilters(filters, "price")} />
                    </ul>
                </div>
                <div className="col-8" >
                    <h2 className="mb-4"> Products: </h2>
                    <div className="row">
                        {filteredResult.map((product, i) => (
                            <div key={i} className="col-4 mb-3">
                                <Card product={product} />
                            </div>
                        ))}
                    </div>
                    <hr />
                    {loadMoreButton()}
                </div>
            </div>
        </Layout>

    )
}

export default Shop