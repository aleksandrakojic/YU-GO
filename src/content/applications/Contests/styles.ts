import { Paper, styled, Box, CardActions } from '@mui/material';

export const AppBar = styled(Paper)({
	display: 'flex',
	justifyContent: 'space-between',
	backgroundColor: '#2d2656',
	padding: '20px',
});

export const FlagWrapper = styled(Box)({
	width: 'max-content',
	marginRight: '10px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

export const CardActionsWrapper = styled(CardActions)(
	({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(3)};
    display: flex;
		align-items: center;
		justify-content: space-between;
    width: 100%;
`
);
