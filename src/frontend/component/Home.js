import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import Snackbar from 'react-toolbox/lib/snackbar';
import { Card, CardActions, CardTitle } from 'react-toolbox/lib/card';
import Tooltip from 'react-toolbox/lib/tooltip';
import Dialog from 'react-toolbox/lib/dialog';

import { Input } from 'react-toolbox/lib/input';
import { graphql } from 'react-apollo';
import addMessageMutation from '../mutations/addMessageMutation';
import getMessageQuery from '../queries/getMessageQuery';
import { generatePassprahse, copyToClipboard } from '../../utils/utils';

const TooltipSpan = Tooltip('span');
let self = null;
class Home extends React.Component {
  constructor() {
    super();
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleChangeEncryptedMessage = this.handleChangeEncryptedMessage.bind(this);
    this.handleAddMessageButton = this.handleAddMessageButton.bind(this);
    this.handleChangeExpiration = this.handleChangeExpiration.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleCancelDialog = this.handleCancelDialog.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.handleDecrypt = this.handleDecrypt.bind(this);
    this.handleSnackbarTimeout = this.handleSnackbarTimeout.bind(this);
    this.generateNewPassphrase = this.generateNewPassphrase.bind(this);
    this.clearErrorFields = this.clearErrorFields.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.state = { name: '', message: '', expiration: new Date(), passphrase: generatePassprahse(), dialogActive: false, encDecMessage: '', messageResult: null, activeSnackbar: false };
    this.actions = [
      { label: 'Close', onClick: this.handleCancelDialog },
      { label: 'Decrypt', onClick: this.handleDecrypt },
    ];
  }

  handleChangeName(e) {
    this.setState({ ...this.state, name: e });
  }

  handleChangeMessage(e) {
    this.setState({ ...this.state, message: e });
  }

  handleChangeEncryptedMessage(e) {
    this.setState({ ...this.state, encDecMessage: e });
  }

  handleAddMessageButton() {
    self = this;
    this.clearErrorFields();
    if (this.validateFields()) {
      this.props.addMessage(
        this.state.name,
        this.state.message,
        this.state.expiration,
        this.state.passphrase).then(() => {
        this.setState({ dialogActive: true });
      });
    }
  }

  handleDecrypt() {
    const { hash } = this.props.location;
    self = this;
    if (!this.state.encDecMessage.length) {
      this.setState({ errorDialog: 'Please provide message to decrypt' });
    } else if (!hash) {
      this.setState({ errorDialog: 'Please provide passphrase' });
    } else {
      this.props.getMessage(hash.substring(1, hash.length), this.state.encDecMessage);
    }
  }

  handleChangeExpiration(e) {
    this.setState({ ...this.state, expiration: e });
  }

  handleCopy(e) {
    e.preventDefault();
    if (copyToClipboard('.passphrase')) {
      this.setState({ activeSnackbar: true });
    }
  }

  generateNewPassphrase(e) {
    e.preventDefault();
    this.setState({
      passphrase: generatePassprahse(),
    });
  }

  handleCancelDialog() {
    this.setState({ dialogActive: false });
  }

  openDialog() {
    this.setState({ dialogActive: true, errorDialog: null });
  }

  handleSnackbarTimeout() {
    this.setState({ activeSnackbar: false });
  }

  clearErrorFields() {
    this.setState({
      nameError: null,
      messageError: null,
      expirationError: null,
      errorDialog: null,
    });
  }

  validateFields() {
    let theNameError;
    let theMessageError;
    let theExpirationError;

    if (!this.state.name.length) theNameError = 'Name is required';

    if (!this.state.message.length) theMessageError = 'Message is required';

    if (!this.state.expiration.toDateString().length) theExpirationError = 'Expiration is required';

    if (this.state.expiration.getTime() < (new Date().getTime() - (24 * 3600000))) theExpirationError = 'Please select feature expiration date';

    if (!theNameError && !theMessageError && !theExpirationError) return true;

    this.setState({
      nameError: theNameError,
      messageError: theMessageError,
      expirationError: theExpirationError,
    });

    return false;
  }

  render() {
    return (
      <div>
        <section style={{ padding: 20 }} >
          <section>
            <form className="form">
              <Card className="form-inner">
                <CardTitle
                  title={'Tovia\'s Enigma'}
                />
                <Input type={'text'} label={'Name *'} name={'name'} value={this.state.name} onChange={this.handleChangeName} error={this.state.nameError} />
                <Input type={'textbox'} label={'Message *'} name={'message'} value={this.state.message} onChange={this.handleChangeMessage} maxLength={120} error={this.state.messageError} />
                <DatePicker label={'Expiration Date *'} onChange={this.handleChangeExpiration} value={this.state.expiration} error={this.state.expirationError} />
                <CardActions>
                  <Button label={('ENCRYPT')} flat onClick={this.handleAddMessageButton} />
                  <Button label={('DECRYPT')} flat onClick={this.openDialog} />
                </CardActions>
              </Card>
              <div className="form-footer">
                <p>Your passprahse - <a href="" className="passphrase"><TooltipSpan tooltip={'Click to copy to clipboard'} tooltipDelay={0} onClick={this.handleCopy}>{this.state.passphrase}</TooltipSpan></a></p>
                <a href="" onClick={this.generateNewPassphrase} >Generate new Passphrase</a>
              </div>
            </form>
          </section>
        </section>
        <Dialog
          actions={this.actions}
          active={this.state.dialogActive}
          onEscKeyDown={this.handleCancelDialog}
          onOverlayClick={this.handleCancelDialog}
          title={'Dec/Encrypt'}
        >
          <Input
            type={'textbox'}
            multiline
            rows={3}
            label={'Message'}
            name={'encDecMessage'}
            value={this.state.encDecMessage}
            onChange={this.handleChangeEncryptedMessage}
            error={this.state.errorDialog}
          />
        </Dialog>
        <Snackbar
          active={this.state.activeSnackbar}
          label={`${this.state.passphrase} copied to clipboard`}
          timeout={2000}
          onTimeout={this.handleSnackbarTimeout}
        />
      </div>
    );
  }
}

const addMessage = graphql(addMessageMutation, {
  props: ({ ownProps, mutate }) => ({
    addMessage(name, message, expiration, passphrase) {
      return mutate({
        variables: {
          name,
          message,
          expiration,
          passphrase,
        },
      }).then((result) => {
        self.setState({
          encDecMessage: result.data.addMessage.message,
        });
      }).catch(() => {
        self.setState({
          errorDialog: 'There was a problem trying to encrypt the message, please try again!',
        });
      });
    },
  }),
});

const getMessage = graphql(getMessageQuery, {
  props: ({ ownProps, mutate }) => ({
    getMessage(passphrase, message) {
      return mutate({
        variables: {
          passphrase,
          message,
        },
      }).then((result) => {
        if (!result.data.getMessage) {
          self.setState({
            errorDialog: 'Could not get any data, please check passprahse, message or expiration date',
          });
          return;
        }
        const d = new Date(result.data.getMessage.expiration);
        self.setState({
          name: result.data.getMessage.name,
          message: result.data.getMessage.message,
          expiration: new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
          dialogActive: false,
        });
      }).catch(() => {
        self.setState({
          errorDialog: 'There was a problem trying to decrypt the message, please try again!',
        });
      });
    },
  }),
});

Home.PropTypes = {
  addMessage: PropTypes.func,
  getMessage: PropTypes.func,
  location: PropTypes.node,
};

Home.defaultProps = {
  addMessage: null,
  getMessage: null,
  location: null,
};

export default addMessage(getMessage(Home));
