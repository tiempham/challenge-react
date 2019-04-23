import React from 'react'
import styled from 'styled-components';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as _ from 'lodash'
import { AvaiableAmount } from '../configs/const.configs'
import Toolbar from '../App';


const Overlay = styled.div`
  background-color: rgba(255,255,255,0.8);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 10px;
  z-index: 10;

`;

const ContentCover = styled.div`
  display: flex;
  border: 1px solid #ddd;
  flex: 1;
  height: 100%;
  background-color: rgba(255,255,255, 0.8);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`



const useStyles = createStyles(theme => ({

  group: {
    flexDirection: 'row',
  },
}));




class ModalAmount extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: '10',
      modalOpen: false
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  changeValue(value) {
    this.setState({
      selectedValue: value,
    })
  }

  openModal(){
    this.setState({
      modalOpen: true,
    })
  }
  closeModal(){
    this.setState({
      modalOpen: false,
    })
  }


  render() {
    const classes = useStyles();
    const { currency, id, handlePay } = this.props
    if(this.state.modalOpen === false){
      return null
    }
    return (

      <Overlay>
        <ClickAwayListener
          onClickAway={this.closeModal}
        >

          <ContentCover>
            <Typography variant="subtitle1" color="inherit" noWrap>
              Select the amount to Donate (USD)
            </Typography>
            <RadioGroup
              aria-label="Gender"
              name="gender1"
              style={classes.group}
              value={this.state.selectedValue}
              onChange={(event) => this.changeValue(event.target.value)}
            >
              {
                _.map(AvaiableAmount, amount => (
                  <FormControlLabel
                    key={amount}
                    value={amount.toString()}
                    control={<Radio />}
                    label={amount.toString()}
                  />
                ))
              }


            </RadioGroup>
            <Button
              variant="outlined"
              className={classes.button}
              onClick={handlePay.call(this,id, parseInt(this.state.selectedValue), currency)}
            >
              Pay
            </Button>
          </ContentCover>

        </ClickAwayListener>
      </Overlay>

    )
  }
}

export default ModalAmount
