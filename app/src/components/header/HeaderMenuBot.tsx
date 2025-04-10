import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';


const HeaderMenuBot = (props:any) => {
    const botUrl = '#/bot/test';
    const botActivate = '#/bot/activate';
    const botCharacter = '#/bot/character';
    const botChannels = '#/bot/channels';
    const botPrompts = '#/bot/prompts';
    const botAutorespond = '#/bot/autorespond';
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
                <MenuItem component="a" href={botCharacter} onClick={handleClose}>Character</MenuItem>
                <MenuItem component="a" href={botChannels} onClick={handleClose}>Channels</MenuItem>
                <MenuItem component="a" href={botPrompts} onClick={handleClose}>Prompts</MenuItem>
                <MenuItem component="a" href={botAutorespond} onClick={handleClose}>Autorespond</MenuItem>
                <MenuItem component="a" href={botUrl} onClick={handleClose}>Test</MenuItem>
            </Menu>
        </div>
    );
};


export default HeaderMenuBot ;
