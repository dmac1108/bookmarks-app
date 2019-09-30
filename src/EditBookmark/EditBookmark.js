import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import '../AddBookmark/AddBookmark.css';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    title: {
      value: ''
    },
    url: {
      value: ''
    },
    description: {
      value: ''
    },
    rating: {
      value: ''
    },
    error: null,
  };
  
  setBookmarks = bookmarks => {
    this.setState({
      title: {value: bookmarks.title},
      url: {value: bookmarks.url},
      description: {value: bookmarks.description},
      rating: {value: bookmarks.rating},
      error: null,
      
    })
  }

  onTitleChange(title){
    this.setState({ title: {value: title}});
  }

  onUrlChange(url){
    this.setState({ url: {value: url}});
  }

  onDescriptionChange(description){
    this.setState({ description: {value: description}});
  }

  onRatingChange(rating){
    this.setState({ rating: {value: rating}});
  }

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    
    const inputValues = {
      title: this.state.title.value,
      url: this.state.url.value,
      description: this.state.description.value,
      rating: this.state.rating.value
    }
    const bookmarkId = this.props.match.params.bookmarkId
    
    this.setState({ error: null })
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(inputValues),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
        return res.json()
      })
      .then(data => {
        this.context.updateBookmark(data)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  componentDidMount(){
    fetch(config.API_ENDPOINT + `/${this.props.match.params.bookmarkId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    const { error } = this.state
    const {title, url, description, rating } = this.state
    return (
      <section className='AddBookmark'>
        <h2>Edit a bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
              onChange = {e => this.onTitleChange(e.target.value)}
              value =  {title.value}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              required
              onChange = {e => this.onUrlChange(e.target.value) }
              value = {url.value}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              onChange = {e => this.onDescriptionChange(e.target.value) }
              value = {description.value}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue='1'
              min='1'
              max='5'
              required
              onChange = {e => this.onRatingChange(e.target.value) }
              value = {rating.value}
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
