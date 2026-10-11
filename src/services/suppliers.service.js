import axiosInstance from '@/configs/axiosConfig'

export async function getSuppliersList() {
  const response = await axiosInstance.get('/Supplier/List')

  return response?.data
}
