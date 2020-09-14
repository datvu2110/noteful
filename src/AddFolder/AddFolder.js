import React from 'react'
import ApiContext from '../ApiContext'
import NotePageNave from '../NotePageMain/NotePageMain'
import config from '../config'
import PropTypes from 'prop-types'



export default class AddFolder extends React.Component {
    state = {
      name: ''
    }

    static defaultProps ={
        addFolder: () => {},
        history: {
            goBack: () => { }
          },
          match: {
            params: {}
          }
      }

      folderID() {
         return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);; 
      }

      static contextType = ApiContext;

      handleAddNote = () => {
        this.props.history.push('/')
      }

      handleSubmit = async (e) => {
        e.preventDefault()
        const id = this.folderID()
        const folder = {
          id,
          title: this.state.name}
        this.setState({ error: null })

        try {
          const res = await fetch(`${config.API_ENDPOINT}/api/folders`, {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: {
              'content-type': 'application/json'
            }
          })
          if (!res.ok) {
            return res.json().then(e => Promise.reject(e))
          }
          const dataJson = await res.json()
          this.context.addFolder(dataJson)
          this.props.history.push('/')
        
        } catch (e) {
          this.setState({ error: e })
        }        
      }

    render() {
       return(
        <form onSubmit = {this.handleSubmit}>
          <label htmlFor="name">Folder Name</label>
          <input 
          type='text'
          name='name'
          id='name'
          placeholder="Folder Name"
          value={this.state.name}
          onChange={(e) => this.setState({name: e.currentTarget.value})}
          required />
          <br></br>
          <button type='submit'>Submit</button>
        </form> 
       ) 
    }
}

AddFolder:PropTypes.exact({
  name: PropTypes.string.isRequired,
  content:PropTypes.string.isRequired,
})