import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';


const HeaderMenuML = (props:any) => {
    const botUrl = '#/ml/bot';
    const likeMeterUrl = '#/ml/like-meter/-';
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
            <Button color={props.color} onClick={handleClick}>ML Models</Button>
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
                <MenuItem component="a" href={botUrl} onClick={handleClose}>Bot</MenuItem>
                <MenuItem component="a" href={likeMeterUrl} onClick={handleClose}>Like Meter</MenuItem>
            </Menu>
        </div>
    );
};


export default HeaderMenuML ;
