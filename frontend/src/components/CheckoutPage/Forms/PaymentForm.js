import React, { useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import MinimizeIcon from '@material-ui/icons/Minimize';
import AddIcon from '@material-ui/icons/Add';
import usePlans from "../../../hooks/usePlans";
import { AuthContext } from "../../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },

  margin: {
    margin: theme.spacing(1),
  },

  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },

  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },

  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },

  customCard: {
    display: "flex",
    marginTop: "16px",
    alignItems: "center",
    flexDirection: "column",
  },

  custom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }
}));

export default function Pricing(props) {
  const {
    setFieldValue,
    setActiveStep,
    activeStep,
  } = props;

  const classes = useStyles();
  const [usersPlans, setUsersPlans] = React.useState(3);
  const [connectionsPlans, setConnectionsPlans] = React.useState(3);
  const [storagePlans, setStoragePlans] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { user } = useContext(AuthContext);

  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      await loadPlans();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const companyId = user.companyId;
      const _planList = await getPlanCompany(undefined, companyId);

      const planList = _planList.plan;

      const plans = []

      plans.push({
        title: planList.name,
        planId: planList.id,
        price: planList.amount,
        description: [
          `${planList.users} Usuários`,
          `${planList.connections} Conexão`,
          `${planList.queues} Filas`
        ],
        users: planList.users,
        connections: planList.connections,
        queues: planList.queues,
        buttonText: 'SELECIONAR',
        buttonVariant: 'outlined',
      })

      // setStoragePlans(data);

      setStoragePlans(plans);
    } catch (e) {
      // toast.error("Não foi possível carregar a lista de registros");
    }
    setLoading(false);
  };

  const [customValuePlans, setCustomValuePlans] = React.useState(49.00);

  const handleChangeAdd = (event, newValue) => {
    if (newValue < 3) return

    const newPrice = 11.00;

    setUsersPlans(newValue);
    setCustomValuePlans(customValuePlans + newPrice);
  }

  const handleChangeMin = (event, newValue) => {
    if (newValue < 3) return

    const newPrice = 11;

    setUsersPlans(newValue);
    setCustomValuePlans(customValuePlans - newPrice);
  }

  const handleChangeConnectionsAdd = (event, newValue) => {
    if (newValue < 3) return
    const newPrice = 20.00;
    setConnectionsPlans(newValue);
    setCustomValuePlans(customValuePlans + newPrice);
  }

  const handleChangeConnectionsMin = (event, newValue) => {
    if (newValue < 3) return
    const newPrice = 20;
    setConnectionsPlans(newValue);
    setCustomValuePlans(customValuePlans - newPrice);
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {storagePlans?.map((tier) => (
          // Enterprise card is full width at sm breakpoint
          <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={12}>
            <Card>
              <CardHeader
                title={tier.title}
                subheader={tier.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={tier.title === 'Pro' ? <StarIcon /> : null}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    {
                      tier.custom ?
                        <React.Fragment>
                          R${customValuePlans.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
                        </React.Fragment>
                        :
                        <React.Fragment>
                          R${tier.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
                        </React.Fragment>
                    }
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /mês
                  </Typography>
                </div>
                <ul>
                  {tier.description.map((line) => (
                    <Typography component="li" variant="subtitle1" align="center" key={line}>
                      {line}
                    </Typography>
                  ))}

                  {
                    tier.custom && (
                      <div className={classes.customCard}>
                        <div className={classes.custom}>
                          <Typography component="li" variant="subtitle1" align="center" key={12}>

                            <IconButton aria-label="delete" className={classes.margin} size="small">
                              <MinimizeIcon fontSize="inherit" onClick={e => handleChangeMin(e, usersPlans - 1)} />
                            </IconButton>
                            {usersPlans} Usuários

                            <IconButton aria-label="delete" className={classes.margin} size="small">
                              <AddIcon fontSize="inherit" onClick={e => handleChangeAdd(e, usersPlans + 1)} />
                            </IconButton>
                          </Typography>
                        </div>

                        <div className={classes.custom}>
                          <Typography component="li" variant="subtitle1" align="center" key={12}>

                            <IconButton aria-label="delete" className={classes.margin} size="small">
                              <MinimizeIcon fontSize="inherit" onClick={(e) => handleChangeConnectionsMin(e, connectionsPlans - 1)} />
                            </IconButton>
                            {connectionsPlans} Conexão

                            <IconButton aria-label="delete" className={classes.margin} size="small">
                              <AddIcon fontSize="inherit" onClick={(e) => handleChangeConnectionsAdd(e, connectionsPlans + 1)} />
                            </IconButton>
                          </Typography>
                        </div>
                      </div>

                    )
                  }

                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color="primary"
                  onClick={() => {
                    if (tier.custom) {
                      setFieldValue("plan", JSON.stringify({
                        users: usersPlans,
                        connections: connectionsPlans,
                        price: customValuePlans
                      }));
                    } else {
                      setFieldValue("plan", JSON.stringify(tier));
                    }

                    setActiveStep(activeStep + 1);
                  }
                  }
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}