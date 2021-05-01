import logo from '../assets/logo.png';

const Header = ({isConnected, fighterName}) => {
    return ( 
        <div class = "header">
            <div class = "header-content">
                <div class = "left">
                    <img src = {logo}/>
                    <div class = "content">
                        WatchDog
                        <div class = "status">
                            <span class = {"status-icon " + (isConnected ? 'green' : 'red')}></span> 
                            {
                                isConnected ? 'Watching' : 'Offline'
                            }
                        </div>
                    </div>
                </div>
                <div class = "center">
                    {!!fighterName.trim() && ('Fighter : ' + fighterName)}
                </div>
                <div class = "right">
                    {/* {!!fighterName.trim() && ('Fighter : ' + fighterName)} */}
                </div>
            </div> 
        </div> 
    );
}
 
export default Header;