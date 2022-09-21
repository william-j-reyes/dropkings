import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../../hooks/useCountdown';
import './CountdownTimer.css';
import { Menu, Icon, Message} from 'semantic-ui-react'
import { ethers } from 'ethers';

const Winner = ({winner}) => {
  return (
    <Message positive>
        <Message.Content>
          <Message.Header>Congratulations! {winner}</Message.Header>
            Your winnings will be delivered shortly...
        </Message.Content>
    </Message>
  );
};

const ExpiredNotice = () => {
  return (
    <Message icon positive>
      <Icon name='circle notched' loading />
        <Message.Content className='msg-content'>
          <Message.Header>It's Time!</Message.Header>
          Wait for winner to be randomly selected...
        </Message.Content>
    </Message>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
      <Menu widths={5}>
        <Menu.Item><DateTimeDisplay value={days} type={'Days'} isDanger={days <= 0}/></Menu.Item>
        <Menu.Item><DateTimeDisplay value={hours} type={'Hours'} isDanger={hours <= 0}/></Menu.Item>
        <Menu.Item><DateTimeDisplay value={minutes} type={'Mins'} isDanger={false}/></Menu.Item>
        <Menu.Item><DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false}/></Menu.Item>
        <Menu.Item><Icon name='hourglass half' size='big' loading/></Menu.Item>
      </Menu>
    );
};

const CountdownTimer = ({ targetDate, winner, status }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  const zero = ethers.constants.AddressZero;
    if ((days + hours + minutes + seconds <= 0 | !status && winner === zero) && (targetDate !== undefined)) {
      return <ExpiredNotice />;
    } else if (!status && winner !== zero){
      return(<Winner winner={winner}/>)
    }
    else {
      return (
        <ShowCounter
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      );
    }
};

export default CountdownTimer;
