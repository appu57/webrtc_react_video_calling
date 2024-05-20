import React from 'react';
const ChatComponent = (props) => {
    const { user } = props
    return (
        <div className="chat__content__container">
            <div className="chat__header">
                <div className="user__image__container">
                    <div className="circle"></div>
                </div>
                <div className="selected__user">
                    <p>{user}</p>
                </div>
            </div>
            <div className="chat__content">

            </div>
            <div className="chat__footer">

            </div>
        </div>
    );
};
export default ChatComponent;