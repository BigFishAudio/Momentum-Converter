import React from 'react';
import { ActionButton } from 'office-ui-fabric-react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import './Message.css';

class Message extends React.Component {

    static type = MessageBarType

    render() {
        const { message, dismiss, dismissAll, numMessages } = this.props
        const { type, isMultiline, truncated, teaser, text } = message
        return (
            <div className="Message">
                {numMessages > 1 &&
                    <ActionButton iconProps={{ iconName: 'RecycleBin' }} allowDisabledFocus onClick={() => {dismissAll()}}>
                        Dismiss all {numMessages} messages
                    </ActionButton>
                }
                <MessageBar
                    messageBarType={type}
                    isMultiline={isMultiline}
                    onDismiss={() => {dismiss()}}
                    dismissButtonAriaLabel="Close"
                    truncated={truncated}
                    overflowButtonAriaLabel="See more"
                >
                    <b>{teaser}</b> {text}
                </MessageBar>
            </div>
        );
    }
}

export default Message;