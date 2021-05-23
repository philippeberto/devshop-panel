import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { fetcher, useMutation, useQuery } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'
import * as Yup from 'yup'

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
  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
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
      const data = await createProduct(values)
      if (data && !data.errors)
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
              {
                data && !!data.errors && <p className="bg-red-200 border-l-4 border-red-500 text-red-700 p-2 mb-4 w-auto">Ocorreu um erro ao salvar o dados.</p>
              }
              <form onSubmit={handleSubmit} className="">
                <Input name='name' placeholder='Nome' onChange={handleChange} value={values.name} type='text' errors={errors.name} />
                <Input name='slug' placeholder='Slug' onChange={handleChange} value={values.slug} type='text' textHelp='Ajuda URL`s amigáveis' errors={errors.slug} />
                <Input name='description' placeholder='Descrição' onChange={handleChange} value={values.description} type='text' errors={errors.description} />
                <Select name='category' onChange={handleChange} value={values.category} options={options} placeholder='Categoria' errors={errors.category} initial={{ id: '', label: 'Selecione uma Categoria...' }} />
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
