import { Helmet } from 'react-helmet'

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request } from 'graphql-request';

import { Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import SingleQuote from './SingleQuote';

function App({ loggedUser }) {
    let { user } = useParams();

    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
        const quotesList = await request(
            'https://api-ap-south-1.graphcms.com/v2/cl4c9cgbv3m1001wd83c03qzq/master',
            `
        query getPosts($postedBy: String!) { 
            
            postsConnection(orderBy: createdAt_DESC, where: {postedBy: {username: $postedBy}}) {
                edges {
                node {
                    id
                    author
                    createdAt
                    quote
                    postedBy {
                    name
                    id
                    username
                    }
                }
                }
            }
        }
        `,
        { postedBy: user }
        );

        setQuotes(quotesList.postsConnection.edges);
        setIsLoading(false)
        };

        fetchProducts();
    }, []);

  return (
    <div className="App">
      <Helmet>
        <title>Quotes posted by {user}</title>
      </Helmet>

      <main>
          <div className='container my-3'>
            <h3 className='mx-3 text-muted'>Quotes posted by {loggedUser == user ? <span>you. <a href="/dashboard" className='btn btn-primary btn-sm'>Post New Quote</a></span>: <span>"{user}"</span>}</h3>
          </div>

          <div className='container my-5'>
            {
                isLoading ?
                <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                :
                quotes.length > 0 ?
                quotes.map(quote=>{
                    return ( <SingleQuote quote={quote} key={quote.node.id}/> )
                })
                :
                <p>No Quotes!</p>
            }
        </div>

      </main>
    </div>
  );
}

export default App;
