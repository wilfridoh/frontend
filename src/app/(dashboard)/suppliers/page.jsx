'use client'

import { useState, useEffect } from 'react'

import SupplierListTable from '@/views/supplier/SupplierListTable'
import { getSuppliersList } from '@/services/suppliers.service'


export default function SuppliersPage() {
  const [suppliersData, setSuppliersData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)

  const getData = async () => {
    setLoading(true)
    const response = await getSuppliersList()

    if (response?.isSuccess) {
      setLoading(false)
      setSuppliersData(response?.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [reload])

  if (isLoading) return <p>Loading...</p>

  return <SupplierListTable suppliersData={suppliersData} setReload={setReload} reload={reload} />
}
