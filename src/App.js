import React, { useState } from 'react'
import shortid from 'shortid'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import './App.css';

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)


  const handleSubmit = async e => {
    e.preventDefault()

    try {
      // encode the full link into a shorter form using shortid
      const id = shortid.generate()
      setShortUrl(`http://mycreativelink/${id}`)

      // store the full link and its corresponding short link in the database
      const response = await fetch('http://localhost:3000/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, url })
      })

      // check for success
      if (response.status !== 200) {
        throw new Error('Failed to create short link')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRedirect = async shortLinkId => {
    try {
      // look up the full link using the short link id
      const response = await fetch(`http://localhost:3000/api/links/${shortLinkId}`)

      // check for success
      if (response.status !== 200) {
        throw new Error('Failed to retrieve full link')
      }

      const { url } = await response.json()
      console.log(url);
      // // redirect the user to the correct page or mobile app
      // history.push(url)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='container'>
      <form
        onSubmit={handleSubmit}
        className='inputContainer'
      >
        <h1>URL <span>Преобразователь</span></h1>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder='Вставьте ссылку для оптимизации'
        />
        <button
          className='submitButton'
          type="submit"
        >
          Конвертировать ссылку
        </button>
        <CopyToClipboard
          text={shortUrl}
          onCopy={() => setCopied(true)}
        >
          <button
            className='submitButton'
            onClick={e => e.preventDefault()}
          >Скопировать ссылку</button>
        </CopyToClipboard>
        {shortUrl && (
          <a href={url} onClick={() => handleRedirect(shortUrl.split('/').pop())}>
            {shortUrl}
          </a>
        )}
      </form>
    </div>
  )
}

export default App;