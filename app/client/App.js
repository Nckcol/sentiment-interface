import React, { Component } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Paper, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, DialogContentText,
  Button} from 'material-ui'


const paperStyles = {
  width: '960px',
  margin: '40px auto',
  padding: '24px'
}
class App extends Component {

  state = {
    dialog: {
      opened: false
    }
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

  handleAddSource = () => {
    fetch('/api/source', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: this.state.sourceField  
      })
    })
      .then((response) => {
        if(response.ok) throw new Error("Request failed")
      })
      .then(() => {
        this.handleRequestClose()
      })    
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" style={{marginRight: 'auto'}}>
              Sentiment analysis
            </Typography>

            <Button color="contrast" onClick={this.handleClickOpen}>Add source</Button>
          </Toolbar>
        </AppBar>

        <Paper style={paperStyles} elevation={2}>
          <Typography type="headline" component="h3">
            This is a sheet of paper.
          </Typography>
          <Typography type="body1" component="p">
            Paper can be used to build surface or other elements for your application.
          </Typography>
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