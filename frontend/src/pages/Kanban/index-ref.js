import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import Board from 'react-trello';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(1)
	},
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
	},
	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	}
}));


const ZDGKanban = () => {
	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(true);

	const [file, setFile] = useState({
		lanes: [
		  {
			id: 'lane1',
			title: 'Configurar Bot > Kanban',
			label: 'ZDG',
			cards: [
				{id: 'ZDG1', title: 'Atenção', description: '1- Tenha ao menos 1 lane cadastrado na opção do Kanban (BOT)\n2- Apenas tickets com status Aberto são mostrados\n3- Aguarde alguns segundos para que seus tickets sejam carregados', label: 'ZDG', draggable: false}
			  ]
		  }
		]
	});

	const laneZDG = {
		lanes: [
		{
			id: 'lane1',
			title: 'Configurar Bot > Kanban',
			label: 'ZDG',
			cards: [
				{id: 'ZDG1', title: 'Atenção', description: '1- Tenha ao menos 1 lane cadastrado na opção do Kanban (BOT)\n2- Apenas tickets com status Aberto são mostrados\n3- Aguarde alguns segundos para que seus tickets sejam carregados', label: 'ZDG', draggable: false}
			]
		}
	  ]
	}

	async function returnStatus(ticketId) {
		try{
			const responseTicketStatus = await api.get("/tickets/" + ticketId);
			return responseTicketStatus.data.status;
		}catch(e){
			console.log(ticketId + ' ticket não existe mais na base.')
		}
	}

	async function popularLanes() {
		try {
		  const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/getLanes');
		  const dados = response.data;
		  const responseCards = await axios.get(process.env.REACT_APP_BACKEND_URL + '/getAllCards');
		  const cards = responseCards.data;
		  if(dados === false) return;
		  const lanes = dados.map(async (item) => {
			const associatedCards = await cards.reduce(async (accumulatorPromise, card) => {
			  const accumulator = await accumulatorPromise;
			  if (card.ticketId !== 'Card Teste') {
				const status = await returnStatus(card.ticketId);
				if (status === 'open' && card.laneId === item.laneId) {
				  accumulator.push(card);
				}
			  }
			  return accumulator;
			}, Promise.resolve([]));
	  
			return {
			  id: item.laneId.toString(),
			  title: item.title,
			  label: item.label,
			  cards: await Promise.all(associatedCards)
			};
		  });
	  
		  return {
			lanes: await Promise.all(lanes)
		  };
		} catch (error) {
		  console.error('Ocorreu um erro na requisição GET:', error);
		  return file;
		}
	}

	const addLinksToCards = (data) => {
		if(data === undefined) return;
		const updatedLanes = data.lanes.map((lane) => {
		  const updatedCards = lane.cards.map((card) => {
			return {
			  ...card,
			  id: card.id.toString(),
			  onClick: () => {
				window.open(`tickets/${card.ticketId}`, '_self'); // Abre o link em uma nova aba
			  }
			};
		  });
	
		  return {
			...lane,
			cards: updatedCards
		  };
		});
	
		return {
		  lanes: updatedLanes
		};
	};

	const [settings, setSettings] = useState([]);

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
	}, []);

	useEffect(() => {
		setIsLoading(true);
		popularLanes()
		  .then((data) => {
			const updatedData = addLinksToCards(data);
			setFile(updatedData);
		  })
		  .catch((error) => console.error('Ocorreu um erro:', error))
		  .finally(() => {
			setIsLoading(false);
		  });
		// eslint-disable-next-line
	}, []);
	
	
	
	const handleCardMove = (cardId, sourceLaneId, targetLaneId) => {
		const token = settings && settings.length > 0 && getSettingValue("userApiToken");
		axios.get(process.env.REACT_APP_BACKEND_URL + '/getCards/' + targetLaneId.toString())
		  .then(response => {
			const card = response.data;
			axios.post(process.env.REACT_APP_BACKEND_URL + '/setCardsLanes', { ticketid: card.ticketId, laneid: sourceLaneId, token: token })
			  .then(response => {
				setFile(prevFile => {
				  const updatedLanes = prevFile.lanes.map(lane => {
					if (lane.id === sourceLaneId) {
					  return {
						...lane,
						cards: lane.cards.filter(card => card.id !== cardId)
					  };
					}
					if (lane.id === targetLaneId) {
					  const movedCard = prevFile.lanes.find(l => l.id === sourceLaneId).cards.find(c => c.id === cardId);
	  
					  // Verifica se o card foi encontrado
					  if (movedCard) {
						return {
						  ...lane,
						  cards: [...lane.cards, movedCard]
						};
					  }
					}
					return lane;
				  });
	  
				  return {
					...prevFile,
					lanes: updatedLanes
				  };
				});
			  })
			  .catch(error => {
				console.error('Ocorreu um erro na requisição POST:', error);
			  });
		  })
		  .catch(error => {
			console.error('Ocorreu um erro na requisição GET:', error);
		  });
	};
	
	return (
		<div className={classes.root}>
			{isLoading ? (
				<div>
					<Board 
					style={{ backgroundColor: "rgba(255, 255, 255, 0.0)" }} 
					data={laneZDG} 
					onCardMoveAcrossLanes={handleCardMove} 
					hideCardDeleteIcon={true}
					/>
					<img src="./loading.gif" alt="Loading" height={'20px'} width={'20px'} />
				</div>
				) : (
				<div>
					<Board 
						style={{ backgroundColor: "rgba(255, 255, 255, 0.0)" }} 
						data={file} 
						onCardMoveAcrossLanes={handleCardMove} 
						hideCardDeleteIcon={true}
					/>
				</div>
			)}
		</div>
		// <div className={classes.root}>
		// 	<Board 
		// 		style={{ backgroundColor: "rgba(255, 255, 255, 0.0)" }} 
		// 		data={file} 
		// 		onCardMoveAcrossLanes={handleCardMove} 
		// 		hideCardDeleteIcon={true}
		// 	/>
		// </div>		
	);

};

export default ZDGKanban;
