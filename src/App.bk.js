import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import axios from 'axios'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { summaryDonations } from './helpers';


const Card = styled.div`
  margin: 10px;
  border: 1px solid #ccc;
`;

export default connect((state) => state)(
  class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        charities: [],
        selectedAmount: 10,
      };
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

    render() {
      const self = this;
      const cards = this.state.charities.map(function(item, i) {
        const payments = [10, 20, 50, 100, 500].map((amount, j) => (
          <label key={j}>
            <input
              type="radio"
              name="payment"
              onClick={function() {
                self.setState({ selectedAmount: amount })
              }} /> {amount}
          </label>
        ));

        return (
          <Grid key={i} item xs>
            <Card>
              <p>{item.name}</p>
              {payments}
              <button onClick={handlePay.call(self, item.id, self.state.selectedAmount, item.currency)}>Pay</button>
            </Card>
          </Grid>

        );
      });

      const style = {
        color: 'red',
        margin: '1em 0',
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
      };
      const donate = this.props.donate;
      const message = this.props.message;

      return (
        <Grid container spacing={24}>
          <Grid xs={12}>
            <h1>Tamboon React</h1>
            <p>All donations: {donate}</p>
            <p style={style}>{message}</p>
          </Grid>

          {cards}
        </Grid>
      );
    }
  }
);

function handlePay(id, amount, currency) {

  const self = this;
  console.log(this)
  return function() {
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
