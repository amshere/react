import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { request } from 'graphql-request';

import { Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import SingleQuote from './SingleQuote';

export default function Quotes(){

  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      const quotesList = await request(
        'https://api-ap-south-1.graphcms.com/v2/cl4c9cgbv3m1001wd83c03qzq/master',
        `
      { 
        postsConnection(orderBy: createdAt_DESC) {
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
    `
      );

      setQuotes(quotesList.postsConnection.edges);
      setIsLoading(false)
    };

    fetchQuotes();
  }, []);

    return(
        <div className='container my-5'>
          <h3 className='my-5 text-muted'>Latest Quotes</h3>
            {
                isLoading ?
                <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                :
                quotes.map(quote=>{
                    return ( <SingleQuote quote={quote} key={quote.node.id}/> )
                })
            }
        </div>
    )
}