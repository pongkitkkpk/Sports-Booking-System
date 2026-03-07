import { useState, useCallback, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import Footer from '../../../../components/Footer';
import PageTitleWrapper from '../../../../components/PageTitleWrapper';

import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import useRefMounted from '../../../../hooks/useRefMounted';
import type { Invoice } from '../../../../models/invoice';
import InvoiceBody from './InvoiceBody';
import PageHeader from './PageHeader';

import axios from '../../../../utils/axios';

function ManagementInvoicesView() {
  const isMountedRef = useRefMounted();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  // @ts-ignore
  const { invoiceId } = useParams();

  const getInvoice = useCallback(async () => {
    try {
      const response = await axios.get<{ invoice: Invoice }>('/api/invoice', {
        params: {
          invoiceId
        }
      });
      if (isMountedRef.current) {
        setInvoice(response.data.invoice);
      }
    } catch (err) {
      console.error(err);
    }
  }, [invoiceId, isMountedRef]);

  useEffect(() => {
    getInvoice();
  }, [getInvoice]);

  if (!invoice) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Invoice Details - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader invoice={invoice} />
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <InvoiceBody invoice={invoice} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementInvoicesView;
