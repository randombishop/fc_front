import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';


const HeaderMenuBot = (props:any) => {
    const botUrl = '#/bot/test';
    const botActivate = '#/bot/activate';
    const botConfigure = '#/bot/configure';
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button color={props.color} onClick={handleClick}>Bot</Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem component="a" href={botActivate} onClick={handleClose}>Activate</MenuItem>
                <MenuItem component="a" href={botConfigure} onClick={handleClose}>Configure</MenuItem>
                <MenuItem component="a" href={botUrl} onClick={handleClose}>Test Actions</MenuItem>
            </Menu>
        </div>
    );
};


export default HeaderMenuBot ;
