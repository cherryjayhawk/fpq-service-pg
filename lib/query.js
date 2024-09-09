import { client } from "./db.js";
import { toIsoString } from "./toIsoString.js";

const date = new Date()

const statuses = [
    {
      label: "Menunggu Pembayaran",
      update: toIsoString(date)
    },
    {
      label: "Pembayaran Diverifikasi",
      update: null,
    },
    {
      label: "Naik Cetak",
      update: null,
    },
    {
      label: "Selesai Cetak",
      update: null,
    },
    {
      label: "Dikirim",
      update: null,
    },
    {
      label: "Diterima",
      update: null,
    },
    {
      label: "Dibatalkan",
      update: null,
    },
  ]

export async function getAllUsers() {
    try {
        const result = await client.query('SELECT * FROM users');
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function getUser(email) {
    try {
        const result = await client.query(`SELECT * FROM users WHERE email = '${email}'`);
        if (result.rows.length > 0) return result
        return undefined
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function insertUser(email, password) {
    try {
        const result = await client.query(`INSERT INTO users(email, password) VALUES ('${email}', '${password}')`);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function getAllInvoices() {
    try {
        const result = await client.query(`SELECT *, invoices.id as id FROM invoices JOIN items ON invoices.id = items.invoice_id ORDER BY created_at DESC`);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function insertInvoice(id, body) {
    try {
        const { email, phone, fullname, note } = body
        const status = 'Menunggu Pembayaran'
        const priority = 'Sedang'

        const result = await client.query(`INSERT INTO invoices(id, email, phone, status, priority, fullname, note, created_at, updated_at) VALUES ('${id}', '${email}', '${phone}', '${status}', '${priority}', '${fullname}', '${note}', '${toIsoString(date)}', '${toIsoString(date)}')`);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function insertItem(id, body) {
    try {
        const { items, total } = body

        const result = await client.query(`
            INSERT INTO items(
                invoice_id, qb_quantity, qb_price, qb_amount, qk_quantity, qk_price, qk_amount, gn_amount, total
                ) VALUES (
                '${id}', ${items.QB_quantity}, ${items.QB_price}, ${items.QB_amount}, ${items.QK_quantity}, ${items.QK_price}, ${items.QK_amount}, ${items.GN_amount}, ${total})
        `);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function deleteInvoice(id) {
    try {
        const result = await client.query(`DELETE FROM invoices WHERE id = '${id}'`);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function updateInvoice(id, status, priority) {
    try {
        const result = await client.query(`UPDATE invoices SET status = '${status}', priority = '${priority}', updated_at = '${toIsoString(date)}' WHERE id = '${id}'`);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function insertLog(id) {
    try {
        const result = await client.query(`
                    INSERT INTO logs(
                        invoice_id, invoice_status, updated_at
                        ) VALUES
                        ('${id}', '${statuses[0].label}', '${statuses[0].update}'),
                        ('${id}', '${statuses[1].label}', NULL),
                        ('${id}', '${statuses[2].label}', NULL),
                        ('${id}', '${statuses[3].label}', NULL),
                        ('${id}', '${statuses[4].label}', NULL),
                        ('${id}', '${statuses[5].label}', NULL),
                        ('${id}', '${statuses[6].label}', NULL)
                `);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function getLogCanceled(id) {
    try {
        const result = await client.query(`SELECT updated_at FROM logs WHERE invoice_id = '${id}' AND invoice_status = 'Dibatalkan' AND updated_at IS NOT NULL`);
        return result.rowCount
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function getLogNotNull(id) {
    try {
        const result = await client.query(`SELECT updated_at FROM logs WHERE invoice_id = '${id}' AND invoice_status != 'Dibatalkan' AND updated_at IS NOT NULL`);
        return result.rowCount
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function getLog(id) {
    try {
        const result = await client.query(`SELECT invoice_status, updated_at FROM logs WHERE invoice_id = '${id}' AND invoice_status != 'Dibatalkan' ORDER BY id ASC`);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export async function updateLog(id, status) {
    try {
        const result = await client.query(`UPDATE logs SET updated_at = '${toIsoString(date)}' WHERE invoice_id = '${id}' AND invoice_status = '${status}'`);
        return result
    } catch (error) {
        console.error(error)
        return undefined
    }
}