import { useState, useEffect } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { request } from 'graphql-request';

import { useNavigate } from 'react-router-dom'

export default function LogIn(){

    let navigate = useNavigate();

    const [ form, setForm ] = useState({username:"", password:""})
    const [ error, setError ] = useState({})

    const [ user, setUser ] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if(isSubmitting){

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

        if(!fetchedUser.author){
            setError({ username: "Username not registered"})
        }else if(fetchedUser.author.password == form.password){
            console.log("Logged in!")
            window.localStorage.setItem('username', form.username)
            navigate(0)
        } else {
            setError({ password: "Your password is Incorrect"})
        }

        setIsSubmitting(false)
        };

        fetchUser();
    }
    }, [isSubmitting]);

    function validateAndSubmit(){
        if(form.username.length>0 && form.password.length>0){
            setIsSubmitting(true)
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
            <h3 className='my-5 text-muted'>Login to your account</h3>
            <Form className='my-5'>
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

                Login
            </Button>
            </Form>
        </div>
    )
}