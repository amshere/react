import { useState, useEffect } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { request } from 'graphql-request';

import { useNavigate } from 'react-router-dom'

export default function LogIn(){

    let navigate = useNavigate();

    const [ form, setForm ] = useState({name: "", username:"", password:""})
    const [ error, setError ] = useState({})

    const [ user, setUser ] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [ success, setSuccess ] = useState('')

    const requestHeaders = {
        authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NTUxMDgyNDgsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmdyYXBoY21zLmNvbS92Mi9jbDRjOWNnYnYzbTEwMDF3ZDgzYzAzcXpxL21hc3RlciIsImh0dHBzOi8vbWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQuZ3JhcGhjbXMuY29tLyIsInN1YiI6IjBkNjhlYWU2LTNkMWYtNDc5Ny1iNTIxLTMxYzUwYzhiYzE2YyIsImp0aSI6ImNsNGNncHR5ZzN5dmIwMXh1ZXBsdTdyMTIifQ.jfR57ZQiNDQjAcmYb3yCDaMbA-GxDCbDQIYxDPuxjOVd9P4hDvTjJc1RfsHSuRefeCAZjhmNG3epRmRvLErse1B9rNoUItjFL34YsPsvxShGiR9l-FAwaaybN9rtSlmSr34miE4OT-qx8haO7wEEAo1R-w7ta0mXvc_M5sPL3Y09Dxw1Pu74iugB9sRe9s2gXIls6Ym2CzcmaRPtkY0i6xLQa-673x59MeU9bMgXtobhG9rvANC73hoPsLp7OYN1Ndu3uJmtA10nETp_PRqweWyqOKvaSMcjiNWIjG3wR52UVsETrMZGGpj7eheEAmUm-1ATZ2p4HGQTuNxcSTT8EM1P-n0D5MAD11IEG9zKuSYPCJWyYFuOKkKdmf2ooAH7uQ_eI4gcGOvSES5FRX0mZeASa-HdsHG81QHO8l1h8qXQBUn5teSL3dxUUmYHp0jEUElNQRnkYYxQJL8YuS5X91-qINl9YDoCNuBxdU-v1013w8VweAT5GiLXWuH4ZFXnE2rUehDoJgIWoRc7hnmHyKwCrrh6ETHh37GOSJ0UcmI3mNOh0AmnXF8nAwntnocKLlkT67NwMf7coL18Nm6RCUWVSZHSEmbT0ovnDfVmKPVuFGK_VlcnxmJNt1fa12NXFGIY3W-qe1tvVojjw5TeBMrBIyxgzPZoNsF-Pb-uiQ0'
      }

    function createAccount(){
        const postAccount = async () => {

            const accountAdd = await request(
                'https://api-ap-south-1.graphcms.com/v2/cl4c9cgbv3m1001wd83c03qzq/master',
                `
                mutation CreateAuthor($name: String!, $username: String!, $password: String!) {
                    createAuthor(data: {name: $name, username: $username, password: $password}) { id }
                }
            `,
            { name: form.name, username: form.username, password: form.password},
            requestHeaders
            );

            const accountPublish = await request(
                'https://api-ap-south-1.graphcms.com/v2/cl4c9cgbv3m1001wd83c03qzq/master',
                `mutation publishAuthor($id: ID!){
                    publishAuthor(where : {id:$id}) {
                        id
                    }
                  }
            `,
            { id: accountAdd.createAuthor.id},
            requestHeaders
            );

            setSuccess('Your Account has been Created!')
            window.localStorage.setItem('username', form.username)
            navigate(0)
        };

        postAccount();
    }

    useEffect(() => {
        if(isSubmitting){
        
        // Check if user exists
        const fetchUser = async () => {
        const fetchedUser = await request(
            'https://api-ap-south-1.graphcms.com/v2/cl4c9cgbv3m1001wd83c03qzq/master',
            `
            query MyQuery($username: String!) { 
                author(where: {username: $username}) {
                    id
                    password
                  }
        }
        `,
        { "username" : form.username}
        );

        setUser(fetchedUser.author);

        if(fetchedUser.author){
            setError({ username: "Username is already registered"})
        } else {
            createAccount()
        }


        setIsSubmitting(false)
        };

        fetchUser();
    }
    }, [isSubmitting]);

    function validateAndSubmit(){
        if(form.name.length>2 && form.username.length>3 && form.password.length>3){
            setIsSubmitting(true)
        } else {
            if(form.name.length<2){
                setError({ ...error, name: "Your name should be greater than 2 letters"})
            }
            if(form.username.length<3){
                setError({ ...error, username: "Your username should be greater than 3 letters"})
            }
            if(form.password.length<3){
                setError({ ...error, password: "Your password should be greater than 2 letters"})
            }
            
        }
    }

    const onInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
      };
    

    return(
        <div className='container'>
            <h3 className='my-5 text-muted'>Signup for an account</h3>

            { success ? 
            <div className="alert alert-primary" role="alert">
                {success}
            </div>
            : ''}

            <Form className='my-5'>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your Full Name" name="name" value={form.name} onChange={onInputChange} required/>

                { error.name ? <Form.Text className="text-muted">
                    <p className='text-danger'>{error.name}</p>
                </Form.Text> : ''}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter your Username" name="username" value={form.username} onChange={onInputChange} required/>

                { error.username ? <Form.Text className="text-muted">
                    <p className='text-danger'>{error.username}</p>
                </Form.Text> : ''}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name="password" value={form.password} onChange={onInputChange} required/>
                { error.password ? <Form.Text className="text-muted">
                    <p className='text-danger'>{error.password}</p>
                </Form.Text> : ''}
            </Form.Group>
            <Button variant="primary" onClick={validateAndSubmit} disabled = {isSubmitting}>
                { isSubmitting ? 
                <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                />
                : '' }

                Create Account
            </Button>
            </Form>
        </div>
    )
}