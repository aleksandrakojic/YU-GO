import { Box, Paper, styled, Container } from '@mui/material';

export const AppBar = styled(Paper)({
	display: 'flex',
	justifyContent: 'space-between',
	backgroundColor: '#2d2656',
	padding: '20px',
});

export const Wrapper = styled(Container)(
	() => `
  display: flex;
  flex-direction: column;
  height: 100vh;
  `
);

export const MainContent = styled(Box)(
	() => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
);

export const PaperItem = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	textAlign: 'center',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: theme.palette.text.primary,
	backgroundColor: theme.palette.background.paper,
	border: '1px solid darkslateblue',
	height: 70,
	width: 250,
	lineHeight: '60px',
	cursor: 'pointer',
	boxShadow: '0px 2px 1px -1px #1b245a, 0px 1px 1px 0px #1b245a, 0px 1px 3px 0px #1b245a',
	'&:hover': {
		boxShadow: '0px 7px 8px -4px #1b245a, 0px 6px 20px 2px #1b245a, 0px 2px 20px 6px #1b245a',
	},
}));

export const PaperContent = styled(Paper)({
	padding: '20px',
});
