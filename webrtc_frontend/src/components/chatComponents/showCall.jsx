const ShowCallScreen = ({ to, rejectTheCall, innerText, remoteUser }) => {
    const checkTheUserResponse = (e) => {
        if (e.target.value == "accept") {
            rejectTheCall({ answer: true });
        }
        else {
            rejectTheCall({ answer: false });
        }
    }
    return (
        <div className="screen__container">

            <div className="call__screen__container">
                <div className="call__screen--image--container">
                    <div className="avatar"></div>
                </div>
                <div className="tag__container">
                    <h2>{innerText} {to}</h2>
                </div>
                <div className="button__container">
                    {
                        remoteUser && (<button className="btn" value="accept" onClick={checkTheUserResponse}>Accept {innerText}</button>
                        )
                    }
                    <button className="btn" value="reject" onClick={checkTheUserResponse}>Reject {innerText}</button>
                </div>
            </div>
        </div>

    );

}
export default ShowCallScreen;