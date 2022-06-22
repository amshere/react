import { useState, useEffect } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { request } from 'graphql-request'

import { useNavigate } from 'react-router-dom'

export default function Dashboard({ loggedUser }){

    const [ form, setForm ] = useState({quote:"", author:"", postedBy: loggedUser})
    const [ error, setError ] = useState({quote:""})
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [ success, setSuccess ] = useState('')

    const requestHeaders = {
        authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NTUxMDgyNDgsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmdyYXBoY21zLmNvbS92Mi9jbDRjOWNnYnYzbTEwMDF3ZDgzYzAzcXpxL21hc3RlciIsImh0dHBzOi8vbWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQuZ3JhcGhjbXMuY29tLyIsInN1YiI6IjBkNjhlYWU2LTNkMWYtNDc5Ny1iNTIxLTMxYzUwYzhiYzE2YyIsImp0aSI6ImNsNGNncHR5ZzN5dmIwMXh1ZXBsdTdyMTIifQ.jfR57ZQiNDQjAcmYb3yCDaMbA-GxDCbDQIYxDPuxjOVd9P4hDvTjJc1RfsHSuRefeCAZjhmNG3epRmRvLErse1B9rNoUItjFL34YsPsvxShGiR9l-FAwaaybN9rtSlmSr34miE4OT-qx8haO7wEEAo1R-w7ta0mXvc_M5sPL3Y09Dxw1Pu74iugB9sRe9s2gXIls6Ym2CzcmaRPtkY0i6xLQa-673x59MeU9bMgXtobhG9rvANC73hoPsLp7OYN1Ndu3uJmtA10nETp_PRqweWyqOKvaSMcjiNWIjG3wR52UVsETrMZGGpj7eheEAmUm-1ATZ2p4HGQTuNxcSTT8EM1P-n0D5MAD11IEG9zKuSYPCJWyYFuOKkKdmf2ooAH7uQ_eI4gcGOvSES5FRX0mZeASa-HdsHG81QHO8l1h8qXQBUn5teSL3dxUUmYHp0jEUElNQRnkYYxQJL8YuS5X91-qINl9YDoCNuBxdU-v1013w8VweAT5GiLXWuH4ZFXnE2rUehDoJgIWoRc7hnmHyKwCrrh6ETHh37GOSJ0UcmI3mNOh0AmnXF8nAwntnocKLlkT67NwMf7coL18Nm6RCUWVSZHSEmbT0ovnDfVmKPVuFGK_VlcnxmJNt1fa12NXFGIY3W-qe1tvVojjw5TeBMrBIyxgzPZoNsF-Pb-uiQ0'
      }

    useEffect(() => {
        if(isSubmitting){

        const postQuote = async () => {

            const quotesAdd = await request(
                'https://api-ap-south-1.graphcms.com/v2/cl4c9cgbv3m1001wd83c03qzq/master',
                `
                mutation CreatePost($quote: String!, $author: String!, $postedBy: String!) {
                    createPost(data: {quote: $quote, author: $author, postedBy: {connect: {username: $postedBy}}}) { id }
                }
            `,
            { quote: form.quote, author: form.author, postedBy: form.postedBy},
            requestHeaders
            );

            const quotesPublish = await request(
                'https://api-ap-south-1.graphcms.com/v2/cl4c9cgbv3m1001wd83c03qzq/master',
                `mutation publishPost($id: ID!){
                    publishPost(where : {id:$id}) {
                        id
                    }
                  }
            `,
            { id: quotesAdd.createPost.id},
            requestHeaders
            );

        setIsSubmitting(false)
        setSuccess('Your Quote has been published!')
        setForm({ quote: '', author: ''})

        };

        postQuote();
    }
    }, [isSubmitting]);


    function validateAndSubmit(){
        if(form.quote.length>3){
            setIsSubmitting(true)
        } else {
            setError({ quote: "Quote should be greater than 3"})
        }
    }

    const onInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
      };

    return(
        <div className="container">
            <p className='mt-5 mb-0'>Welcome <strong>{loggedUser}</strong>,</p>
            <h3 className="mb-5 text-muted">Post a new Quote</h3>

            { success ? 
            <div className="alert alert-primary" role="alert">
                {success}
            </div>
            : ''}

            <div>
            <Form className='my-5'>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Quote (required):</Form.Label>
                <Form.Control as="textarea" row={3} placeholder="Enter a Quote" name="quote" value={form.quote} onChange={onInputChange} required/>

                { error.quote ? <Form.Text className="text-muted">
                    <p className='text-danger'>{error.quote}</p>
                </Form.Text> : ''}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Author:</Form.Label>
                <Form.Control type="text" placeholder="Enter the Author" name="author" value={form.author} onChange={onInputChange}/>
            </Form.Group>
            <Button variant="primary" onClick={validateAndSubmit} disabled={isSubmitting}>
                { isSubmitting ? 
                <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                />
                : '' }

                Post Quote
            </Button>
            </Form>
            </div>
        </div>
    )
}