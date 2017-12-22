import React, { Component } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Paper, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, DialogContentText,
  Button} from 'material-ui'

import './App.css'

const paperStyles = {
  width: '960px',
  margin: '40px auto',
  padding: '24px'
}
class App extends Component {

  state = {
    dialog: {
      opened: false
    },
    sentence: '',
    textField: ''
  }

  constructor() {
    super()

    this.getSentence()
  }

  handleClickOpen = () => {
    this.setState({ 
      dialog: {
        open: true
      } 
    })
  }

  handleRequestClose = () => {
    this.setState({
      dialog: {
        open: false
      }
    })
  }

  handleSourceTextChange = (event) => {
    this.setState({
      sourceField: event.target.value
    })
  } 

  handleTextChange = (event) => {
    this.setState({
      textField: event.target.value
    })
  } 

  getSentence = () => {
    fetch('http://localhost:3080/api/sentence', {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response)=>{
      return response.json()
    })
    .then(res => {
      this.setState({
        sentence: res.data
      })
    })
  }

  handleClassification = () => {
    this.classify(this.state.textField)
  }

  handleAddSource = () => {
    fetch('/api/source', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: this.state.sourceField  
      })
    })
      .then((response) => {
        if(!response.ok) throw new Error("Request failed")
      })
      .then(() => {
        this.handleRequestClose()
      })    
  }

  classify = (text) => {
    fetch('http://localhost:3080/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text
      })
    })
      .then((response) => {
        if(!response.ok) throw new Error("Request failed")
        return response.json()
      })
      .then((response) => {
        this.setState({
          classifaction: response.data
        })
      })
  }

  renderClassification() {
    return (
      <p>
        {
          this.state.classifaction.map( ({ sentence, emotion }, index) => {
            return (
              <span key={index} className="sentence">
                <span className="sentence-emotion">{ emotion }</span>
                { sentence }
              </span>
            )
          })
        }
      </p>
    )
  }

  clearClassification = (e) => {
    e.preventDefault()
    this.setState({
      classifaction: null
    })
  }

  renderResult() {
    return (
      <div>
        { this.renderClassification() }
        <br />
        <Button color="accent" onClick={this.clearClassification}>Back</Button>
      </div>
    )
  }

  renderForm() {
    return (
      <div>
        <TextField
              label="Paste text here"
              multiline
              rowsMax="4"
              value={this.state.textField}
              onChange={this.handleTextChange}
              margin="normal"
              fullWidth
              className="textField"
        />
        <br />
        <Button color="primary" onClick={this.handleClassification}>Classify</Button>
      </div>
    )
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" style={{marginRight: 'auto'}}>
              Sentiment analysis
            </Typography>

            {/* <Button color="contrast" onClick={this.handleClickOpen}>Add source</Button> */}
          </Toolbar>
        </AppBar>

        <Paper style={paperStyles} elevation={2}>
          <Typography type="headline">Classify your text sentences by emotions.</Typography>
          <br />

          {
            this.state.classifaction
            ? this.renderResult()
            : this.renderForm()
          }


          {
          //<Button color="primary" onClick={this.getSentence}>Positive</Button>
          // <Button color="primary" onClick={this.getSentence}>Negative</Button>
          // <Button color="accent" onClick={this.getSentence}>Skip</Button>
          }
        </Paper>

        
        <Dialog open={this.state.dialog.open} onRequestClose={this.handleRequestClose}>
          <DialogTitle>Add source text</DialogTitle>
          <DialogContent>
            <TextField
              label="Paste text here"
              multiline
              rowsMax="4"
              value={this.state.sourceField}
              onChange={this.handleSourceTextChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="secondary">Cancel</Button>
            <Button onClick={this.handleAddSource} color="primary" autoFocus>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export {
  App
}