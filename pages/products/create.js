import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation, useQuery } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'

const GET_ALL_CATEGORIES = `
  query {
    getAllCategories {
      id
      name
      slug
    }
  }
`

const CREATE_PRODUCT = `
    mutation createProduct($name: String!, $slug: String!, $description: String!, $category: String!) {
      createProduct (input: {
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
  const [data, createProduct] = useMutation(CREATE_PRODUCT)
  const { data: categories, getAllCategories } = useQuery(GET_ALL_CATEGORIES)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    onSubmit: async values => {
      await createProduct(values)
      router.push('/products')
    }
  })

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
        <Title>Criar produto</Title>
        <div className='my-4'>
          <Button.LinkOut href='/products'>Voltar</Button.LinkOut>
        </div>
        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12">
              <form onSubmit={form.handleSubmit} className="">
                <Input name='name' placeholder='Nome' onChange={form.handleChange} value={form.values.name} type='text' />
                <Input name='slug' placeholder='Slug' onChange={form.handleChange} value={form.values.slug} type='text' textHelp='Ajuda URL`s amigáveis' />
                <Input name='description' placeholder='Descrição' onChange={form.handleChange} value={form.values.description} type='text' />
                <Select name='category' onChange={form.handleChange} value={form.values.category} options={options} placeholder='Categoria' />
                <div className='m-2'>
                  <Button type='submit'>Salvar</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Products
