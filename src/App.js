import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import {Class} from '@material-ui/icons';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CloseIcon from '@material-ui/icons/Close';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import axios from 'axios';


import {summaryDonations} from './helpers';
import {connect} from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ModalAmount from './ui/modalAmount'

class Album extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      charities: [],
      selectedAmount: 10,
      openSnackBar: false,
    };
    this.amountModal = []
    this.handlePay = this.handlePay.bind(this)
  }

  handlePay(id, amount, currency) {

    const self = this;

    return function() {
      _.map(self.amountModal, modal => {
        if(!_.isNil(modal) && !_.isNil(modal.closeModal)){
          modal.closeModal()
        }
      })
      axios.post('http://localhost:3001/payments', {
        charitiesId: id,
        amount,
        currency,
      })
        .then(function() {
          self.props.dispatch({
            type: 'UPDATE_TOTAL_DONATE',
            amount,
          });
          self.props.dispatch({
            type: 'UPDATE_MESSAGE',
            message: `Thanks for donate ${amount}!`,
          });

          setTimeout(function() {
            self.props.dispatch({
              type: 'UPDATE_MESSAGE',
              message: '',
            });
          }, 2000);
        });
    }
  }





  render() {
    const { classes, donate, message } = this.props;


    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={message !== ''}
          autoHideDuration={6000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}

        />
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <CameraIcon className={classes.icon} />
            <Typography variant="h6" color="inherit" noWrap>
              All donations: {donate}
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Thai charities
              </Typography>
              <Typography variant="h6" align="center" color="textSecondary" paragraph>
                Something short and leading about the collection below—its contents, the creator, etc.
                Make it short and sweet, but not too short so folks don&apos;t simply skip over it
                entirely.
              </Typography>
              <Typography align="center" >
                {message}
              </Typography>
            </div>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={40}>
              {this.state.charities.map(card => (
                <Grid item key={card.id} xs={12} sm={6} md={6} lg={6}>
                  <Card className={classes.card}>
                    <ModalAmount
                      ref={(md) => this.amountModal[card.id] = md}
                      id={card.id}
                      currency={card.currency}
                      handlePay={this.handlePay}
                    />
                    <CardMedia
                      className={classes.cardMedia}
                      image={'/images/'+card.image}
                      title={card.name}
                    />
                    <CardActions className={classes.actions} disableActionSpacing>
                      <Grid item={true} xs={12}>
                        <Typography variant="subtitle1" component="h2">
                          {card.name}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Button
                          variant="outlined"
                          className={classes.button}
                          onClick={() => this.amountModal[card.id].openModal()}
                        >
                          Donate
                        </Button>
                      </Grid>


                    </CardActions>

                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Something here to give the footer a purpose!
          </Typography>
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }

  componentDidMount() {
    const self = this;
    axios.get('http://localhost:3001/charities')
      .then(({data}) => {
        self.setState({ charities: data }) });

    axios.get('http://localhost:3001/payments')
      .then(function({data}) {
        self.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount: summaryDonations(data.map((item) => (item.amount))),
        });
      })
  }



}

Album.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect((state) => state)(withStyles(styles)(Album));
