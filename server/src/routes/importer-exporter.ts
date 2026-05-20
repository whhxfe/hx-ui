import { Hono } from 'hono'
import * as XLSX from 'xlsx'

const app = new Hono()

// 生成测试数据
function generateTestData() {
	const departments = ['研发部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部']
	const statuses = ['active', 'inactive']
	const names = [
		'张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
		'郑一', '王二', '冯三', '陈四', '褚五', '卫六', '蒋七', '沈八',
		'韩九', '杨十', '朱一', '秦二', '尤三', '许四', '何五', '吕六',
		'施七', '张八', '孔九', '曹十', '严一', '华二', '金三', '魏四',
		'陶五', '姜六', '戚七', '谢八', '邹九', '喻十', '柏一', '水二',
		'窦三', '章四', '云五', '苏六', '潘七', '葛八', '奚九', '范十',
		'彭一', '郎二', '鲁三', '韦四', '昌五', '马六', '苗七', '凤八',
		'花九', '方十', '俞一', '任二', '袁三', '柳四', '酆五', '鲍六',
		'史七', '唐八', '费九', '廉十', '岑一', '薛二', '雷三', '贺四',
		'倪五', '汤六', '滕七', '殷八', '罗九', '毕八', '郝八', '邬八',
		'安八', '常八', '乐八', '于八', '时八', '傅八', '皮八', '卞八',
		'齐八', '康八', '伍八', '余八', '元八', '卜八', '顾八', '孟八',
		'平八', '黄八', '穆八', '萧八', '尹八', '姚八', '邵八', '湛八',
		'汪八', '祁八', '毛八', '禹八', '狄八', '米八', '贝八', '明八',
		'臧八', '计八', '伏八', '成八', '戴八', '谈八', '宋八', '茅八',
		'庞八', '熊八', '纪八', '舒八', '屈八', '项八', '祝八', '董八',
	]

	return names.map((name, index) => ({
		id: index + 1,
		name,
		age: 20 + Math.floor(Math.random() * 30),
		department: departments[index % departments.length],
		status: statuses[index % 2],
	}))
}

const allData = generateTestData()

// 生成 Excel 文件
function generateExcelWorkbook(data: string[][], sheetName: string = 'Sheet1'): Buffer {
	const worksheet = XLSX.utils.aoa_to_sheet(data)
	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
	return Buffer.from(XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }))
}

// ——————————————————————————————————
// 导入接口
// ——————————————————————————————————

// 下载导入模板
app.get('/import/template', async (c) => {
	// 生成 Excel 模板：表头 + 示例数据
	const templateData = [
		['姓名', '年龄', '部门', '状态'],
		['张三', '28', '研发部', '在职'],
		['李四', '32', '产品部', '在职'],
		['王五', '25', '设计部', '离职'],
	]

	const buffer = generateExcelWorkbook(templateData, '导入模板')

	c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	c.header('Content-Disposition', 'attachment; filename="import_template.xlsx"')

	return c.body(buffer)
})

// 上传文件
app.post('/import/upload', async (c) => {
	const form = await c.req.formData()
	const file = form.get('file') as File | null

	if (!file) {
		return c.json({ code: 400, message: '未找到上传文件' }, 400)
	}

	// 读取文件内容
	const arrayBuffer = await file.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)

	// 解析 Excel 文件
	try {
		const workbook = XLSX.read(buffer, { type: 'buffer' })
		const sheetName = workbook.SheetNames[0]
		const sheet = workbook.Sheets[sheetName]
		const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

		// 返回解析结果
		return c.json({
			code: 0,
			data: {
				fileName: file.name,
				fileSize: file.size,
				rowCount: data.length - 1, // 减去表头
				headers: data[0],
				sampleData: data.slice(1, 6), // 前5行数据
			},
		})
	} catch (e) {
		return c.json({
			code: 400,
			message: '文件解析失败，请上传正确的 Excel 文件',
		}, 400)
	}
})

// ——————————————————————————————————
// 导出接口
// ——————————————————————————————————

// 导出数据（直接返回文件）
app.post('/export', async (c) => {
	const params = await c.req.json()

	// 收集要导出的数据
	let exportDataList = [...allData]

	// 按数量导出
	if (params.pageSize && !params.page && !params.ids) {
		exportDataList = allData.slice(0, params.pageSize)
	}

	// 按页导出
	if (params.page && params.pageSize) {
		const start = (params.page - 1) * params.pageSize
		const end = start + params.pageSize
		exportDataList = allData.slice(start, end)
	}

	// 选中导出
	if (params.ids && params.ids.length > 0) {
		const idSet = new Set(params.ids)
		exportDataList = allData.filter((item) => idSet.has(item.id))
	}

	// 转换为 Excel 格式
	const exportData = [
		['ID', '姓名', '年龄', '部门', '状态'],
		...exportDataList.map((item) => [
			item.id,
			item.name,
			item.age,
			item.department,
			item.status === 'active' ? '在职' : '离职',
		]),
	]

	const buffer = generateExcelWorkbook(exportData, '导出数据')

	c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	c.header('Content-Disposition', `attachment; filename="export_${Date.now()}.xlsx"`)

	return c.body(buffer)
})

// 获取表格数据（带分页）
app.get('/data', async (c) => {
	const page = parseInt(c.req.query('page') || '1')
	const pageSize = parseInt(c.req.query('pageSize') || '10')

	const start = (page - 1) * pageSize
	const end = start + pageSize

	return c.json({
		code: 0,
		data: {
			list: allData.slice(start, end),
			total: allData.length,
			page,
			pageSize,
		},
	})
})

export default app
