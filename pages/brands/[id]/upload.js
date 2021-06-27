import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import { useUpload, useQuery, fetcher } from '../../../lib/graphql'
import { Form, useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../../components/Button'
import * as Yup from 'yup'

const UPLOAD_BRAND_LOGO = `
    mutation uploadBrandLogo($id: String!, $file: Upload!) {
      uploadBrandLogo(
        id: $id,
        file: $file,
      )
    }
  `

const Upload = () => {
  const router = useRouter()
  const { data } = useQuery(`
    query{
      getBrandById (id:"${router.query.id}"){
      name
      slug
    }
  }
  `)
  console.log(router.query.id)
  const [updatedData, uploadBrandLogo] = useUpload(UPLOAD_BRAND_LOGO)
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } = useFormik({
    initialValues: {
      file: ''
    },
    onSubmit: async values => {
      const logo = {
        id: router.query.id,
        ...values
      }
      const data = await uploadBrandLogo(logo)
      if (data && !data.errors)
        router.push('/brands')
    }
  })

  return (
    <>
      <Layout>
        <Title>Upload da Imagem da Marca {data && data.getBrandById && data.getBrandById.name}</Title>
        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12">
              {
                updatedData && !!updatedData.errors && <p className="bg-red-200 border-l-4 border-red-500 text-red-700 p-2 mb-4 w-auto">Ocorreu um erro ao salvar o dados.</p>
              }
              <form onSubmit={handleSubmit}>
                <input type='file' name='file' onChange={evt => {
                  console.log(evt.currentTarget.files[0])
                  setFieldValue('file', evt.currentTarget.files[0])
                }} />
                <Button type='submit'>Enviar</Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Upload
