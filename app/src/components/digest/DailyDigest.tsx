import React from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


class DailyDigest extends React.Component {
  

  render() {
    return (
      <Grid container spacing={3}>

        <Grid item md={12}>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              Accordion 1
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              Accordion 2
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              Accordion Actions
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </AccordionDetails>
            <AccordionActions>
              <Button>Cancel</Button>
              <Button>Agree</Button>
            </AccordionActions>
          </Accordion>

        </Grid>

      </Grid>
      
    );
  }
}

export default DailyDigest;
