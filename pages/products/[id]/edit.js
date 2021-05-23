import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Select from '../../../components/Select'
import * as Yup from 'yup'

let id = ''

const GET_ALL_CATEGORIES = `
  query {
    getAllCategories {
      id
      name
      slug
    }
  }
`

const UPDATE_PRODUCT = `
  mutation updateProduct($id: String!, $name: String!, $slug: String!, $description: String!, $category: String!) {
    updateProduct (input: {
      id: $id
      name: $name
      slug: $slug
      description: $description
      category: $category
      
    }) {
      id
      name
      slug
      description
    }
  }
  `

const Products = () => {
  const router = useRouter()
  id = router.query.id
  const { data } = useQuery(`
    query{
      getProductById (id:"${router.query.id}"){
      name
      slug
      description
      category
    }
  }
  `)
  const [updatedData, updateProduct] = useMutation(UPDATE_PRODUCT)
  const { data: categories, getAllCategories } = useQuery(GET_ALL_CATEGORIES)

  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'O nome deve ter ao menos 3 caracteres.')
        .required('Campo obrigatório.'),
      slug: Yup.string()
        .min(3, 'O slug deve ter ao menos 3 caracteres.')
        .required('Campo obrigatório.')
        .test('isUnique', 'Este slug já existe.', async (value) => {
          const result = await fetcher(JSON.stringify({
            query: `
              query {
                getProductBySlug( slug: "${value}"){
                  id
                }
              }
          `}))
          if (result.data && result.data.getProductBySlug.id === id)
            return true
          return result.errors ? true : false
        }),
      description: Yup.string()
        .min(3, 'O nome deve ter ao menos 3 caracteres.')
        .required('Campo obrigatório.'),
      category: Yup.string()
        .min(1, 'O nome deve ter ao menos 3 caracteres.')
        .required('Campo obrigatório.')
    }),
    onSubmit: async values => {
      const product = {
        id: router.query.id,
        ...values
      }
      const data = await updateProduct(product)
      if (data && !data.errors)
        router.push('/products')
    }
  })
  useEffect(() => {
    if (data && data.getProductById) {
      setFieldValue('name', data.getProductById.name)
      setFieldValue('slug', data.getProductById.slug)
      setFieldValue('description', data.getProductById.description)
      setFieldValue('category', data.getProductById.category)
    }
  }, [data])

  let options = []
  if (categories && categories.getAllCategories) {
    options = categories.getAllCategories.map(category => {
      return {
        id: category.id,
        label: category.name
      }
    })
  }

  return (
    <>
      <Layout>
        <Title>Editar produto</Title>
        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12">
              {
                updatedData && !!updatedData.errors && <p className="bg-red-200 border-l-4 border-red-500 text-red-700 p-2 mb-4 w-auto">Ocorreu um erro ao salvar o dados.</p>
              }
              <form onSubmit={handleSubmit}>
                <Input name='name' placeholder='Nome' onChange={handleChange} value={values.name} type='text' errors={errors.name} />
                <Input name='slug' placeholder='Slug' onChange={handleChange} value={values.slug} type='text' errors={errors.slug} textHelp='Ajuda URL`s amigáveis' />
                <Input name='description' placeholder='Descrição' onChange={handleChange} value={values.description} type='text' errors={errors.description} />
                <Select name='category' onChange={handleChange} value={values.category} options={options} placeholder='Categoria' errors={errors.category} initial={{ id: '', label: 'Selecione uma Categoria...' }} />
                <Button type='submit'>Editar</Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Products
