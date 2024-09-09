import { Router } from "express"
import randomize from "randomatic"
import authToken from '../lib/auth.js'
import { deleteInvoice, getAllInvoices, insertInvoice, insertItem, updateInvoice, insertLog, getLog, getLogNotNull, getLogCanceled, updateLog } from "../lib/query.js"
import { injector } from "../lib/injector.js"

const router = Router()

router.get('/', async (req, res) => {
    console.log("get invoices")
	try {
        const invoices = await getAllInvoices()

        if (invoices.rowCount === 0) {
            console.log("get invoices completed")
            return res.status(200).json({ success: true, message: "Data kosong", data: [] })
        } 

        let data = []

        invoices.rows.map((row) => {
            const { invoice_id, qb_quantity, qb_price, qb_amount, qk_quantity, qk_price, qk_amount, gn_amount, ...r } = row
            data.push({
                ...r,
                items: {
                    QB_quantity: qb_quantity, 
                    QB_price: qb_price, 
                    QB_amount: qb_amount, 
                    QK_quantity: qk_quantity, 
                    QK_price: qk_price, 
                    QK_amount: qk_amount, 
                    GN_amount: gn_amount
                }
            })
        })

        for (let index = 0; index < data.length; index++) {
            const row = data[index]
            const canceled = await getLogCanceled(row.id)
            if (canceled === 0) {
                const log = await getLog(row.id)
                data[index] = { ...row, updated_list: log.rows, canceled: false }
            } else {
                data[index] = { ...row, updated_list: [], canceled: true }
            }
        }

        console.log("get invoices completed")
        return res.status(200).json({ success: true, data: data });
	} catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error, message: 'Tidak dapat mengambil data' });
	}
});

router.post('/', async (req, res) => {
    console.log('inserting new invoice...')
	try {
        const id = randomize('A0', 16)
        const { email, fullname, phone, note } = req.body
        if (injector(email) || injector(fullname) || injector(phone) || injector(note)) {
            return res.status(403).json({ success: false })
        }
        const invoice = await insertInvoice(id, req.body)

        if (invoice === undefined) return res.status(500).json({ success: false })

        const item = await insertItem(id, req.body)

        if (item === undefined) {
            await deleteInvoice(id)
            return res.status(500).json({ success: false })
        }

        const log = await insertLog(id)

        console.log('insert new invoice completed')
		return res.status(200).json({ success: true })
	} catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
	}
});

router.put('/:invoicesId', authToken, async (req, res) => {
    console.log('updating invoice...')
    try {
        const id = req.params.invoicesId;
        const status = req.body.status
        const priority = req.body.priority

        if (injector(id) || injector(status) || injector(priority)) return res.status(403).json({ success: false, message: 'Tidak dapat memperbarui wakaf' })

        const invoice = await updateInvoice(id, status, priority)

        if (invoice === undefined) return res.status(500).json({ success: false, message: 'Tidak dapat memperbarui wakaf' })
        
        const log = await updateLog(id, req.body.status)

        console.log('update invoice completed')
        return res.status(200).json({success: true, message: 'Pembaharuan wakaf sukses!'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error, message: 'Tidak dapat memperbarui wakaf' });
    }
});

export default router