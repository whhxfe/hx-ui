export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface CascaderOption {
  label: string;
  value: string | number;
  children?: CascaderOption[];
  leaf?: boolean;
}

export const selectOptions: SelectOption[] = [
  { label: "北京市", value: "beijing" },
  { label: "上海市", value: "shanghai" },
  { label: "广州市", value: "guangzhou" },
  { label: "深圳市", value: "shenzhen" },
  { label: "杭州市", value: "hangzhou" },
  { label: "南京市", value: "nanjing" },
  { label: "成都市", value: "chengdu" },
  { label: "武汉市", value: "wuhan" },
  { label: "西安市", value: "xian", disabled: true },
  { label: "重庆市", value: "chongqing" },
];

export const selectGroupOptions: SelectOption[] = [
  { label: "热门城市", value: "hot" },
  { label: "北京市", value: "beijing" },
  { label: "上海市", value: "shanghai" },
  { label: "广州市", value: "guangzhou" },
  { label: "深圳市", value: "shenzhen" },
  { label: "普通城市", value: "normal" },
  { label: "杭州市", value: "hangzhou" },
  { label: "南京市", value: "nanjing" },
  { label: "成都市", value: "chengdu" },
  { label: "禁用城市", value: "disabled", disabled: true },
];

export const cascaderOptions: CascaderOption[] = [
  {
    label: "湖北省",
    value: "hubei",
    children: [
      {
        label: "武汉市",
        value: "wuhan",
        children: [
          { label: "江岸区", value: "jiangan" },
          { label: "江汉区", value: "jianghan" },
          { label: "硚口区", value: "qiaokou" },
          { label: "汉阳区", value: "hanyang" },
          { label: "武昌区", value: "wuchang" },
          { label: "青山区", value: "qingshan" },
          { label: "洪山区", value: "hongshan" },
          { label: "东西湖区", value: "dongxihu" },
          { label: "汉南区", value: "hannan" },
          { label: "蔡甸区", value: "caidian" },
          { label: "江夏区", value: "jiangxia" },
          { label: "黄陂区", value: "huangpi" },
          { label: "新洲区", value: "xinzhou" },
        ],
      },
      {
        label: "黄石市",
        value: "huangshi",
        children: [
          { label: "黄石港区", value: "huangshigang" },
          { label: "西塞山区", value: "xishaishan" },
          { label: "下陆区", value: "xialu" },
          { label: "铁山区", value: "tieshan" },
          { label: "阳新县", value: "yangxin" },
          { label: "大冶市", value: "daye" },
        ],
      },
      {
        label: "十堰市",
        value: "shiyan",
        children: [
          { label: "茅箭区", value: "maojian" },
          { label: "张湾区", value: "zhangwan" },
          { label: "郧阳区", value: "yunyang" },
          { label: "郧西县", value: "yunxi" },
          { label: "竹山县", value: "zhushan" },
          { label: "竹溪县", value: "zhuxi" },
          { label: "房县", value: "fangxian" },
          { label: "丹江口市", value: "danjiangkou" },
        ],
      },
      {
        label: "宜昌市",
        value: "yichang",
        children: [
          { label: "西陵区", value: "xiling" },
          { label: "伍家岗区", value: "wujiagang" },
          { label: "点军区", value: "dianjun" },
          { label: "猇亭区", value: "xiaoting" },
          { label: "夷陵区", value: "yiling" },
          { label: "远安县", value: "yuanan" },
          { label: "兴山县", value: "xingshan" },
          { label: "秭归县", value: "zigong" },
          { label: "长阳土家族自治县", value: "changyang" },
          { label: "五峰土家族自治县", value: "wufeng" },
          { label: "宜都市", value: "yidu" },
          { label: "当阳市", value: "dangyang" },
          { label: "枝江市", value: "zhijiang" },
        ],
      },
      {
        label: "襄阳市",
        value: "xiangyang",
        children: [
          { label: "襄城区", value: "xiangcheng" },
          { label: "樊城区", value: "fancheng" },
          { label: "襄州区", value: "xiangzhou" },
          { label: "南漳县", value: "nanzhang" },
          { label: "谷城县", value: "gucheng" },
          { label: "保康县", value: "baokang" },
          { label: "老河口市", value: "laohekou" },
          { label: "枣阳市", value: "zaoyang" },
          { label: "宜城市", value: "yicheng" },
        ],
      },
      {
        label: "荆州市",
        value: "jingzhou",
        children: [
          { label: "沙市区", value: "shashi" },
          { label: "荆州区", value: "jingzhouqu" },
          { label: "公安县", value: "gongan" },
          { label: "监利市", value: "jianli" },
          { label: "江陵县", value: "jiangling" },
          { label: "石首市", value: "shishou" },
          { label: "洪湖市", value: "honghu" },
          { label: "松滋市", value: "songzi" },
        ],
      },
      {
        label: "恩施土家族苗族自治州",
        value: "enshi",
        children: [
          { label: "恩施市", value: "enshishi" },
          { label: "利川市", value: "lichuan" },
          { label: "建始县", value: "jianshi" },
          { label: "巴东县", value: "badong" },
          { label: "宣恩县", value: "xuanen" },
          { label: "咸丰县", value: "xianfeng" },
          { label: "来凤县", value: "laifeng" },
          { label: "鹤峰县", value: "hefeng" },
        ],
      },
      {
        label: "黄冈市",
        value: "huanggang",
        children: [
          { label: "黄州区", value: "huangzhouqu" },
          { label: "团风县", value: "tuofeng" },
          { label: "红安县", value: "hongan" },
          { label: "罗田县", value: "luotian" },
          { label: "英山县", value: "yingshan" },
          { label: "浠水县", value: "xishui" },
          { label: "蕲春县", value: "qichun" },
          { label: "黄梅县", value: "huangmei" },
          { label: "武穴市", value: "wuxue" },
          { label: "麻城市", value: "macheng" },
          { label: "红安县", value: "hongan2" },
        ],
      },
      {
        label: "咸宁市",
        value: "xianning",
        children: [
          { label: "咸安区", value: "xianan" },
          { label: "嘉鱼县", value: "jiayu" },
          { label: "通城县", value: "tongcheng" },
          { label: "崇阳县", value: "chongyang" },
          { label: "通山县", value: "tongshan" },
          { label: "赤壁市", value: "chibi" },
        ],
      },
      {
        label: "随州市",
        value: "suizhou",
        children: [
          { label: "曾都区", value: "zengdu" },
          { label: "随县", value: "suixian" },
          { label: "广水市", value: "guangshui" },
        ],
      },
      {
        label: "鄂州市",
        value: "ezhou",
        children: [
          { label: "梁子湖区", value: "liangzihu" },
          { label: "华容区", value: "huarong" },
          { label: "鄂城区", value: "echeng" },
        ],
      },
      {
        label: "荆门市",
        value: "jingmen",
        children: [
          { label: "东宝区", value: "dongbao" },
          { label: "掇刀区", value: "duodao" },
          { label: "沙洋县", value: "shayang" },
          { label: "钟祥市", value: "zhongxiang" },
          { label: "京山市", value: "jingshan" },
        ],
      },
      {
        label: "孝感市",
        value: "xiaogan",
        children: [
          { label: "孝南区", value: "xiaonan" },
          { label: "孝昌县", value: "xiaochang" },
          { label: "大悟县", value: "dawu" },
          { label: "云梦县", value: "yunmeng" },
          { label: "应城市", value: "yingcheng" },
          { label: "安陆市", value: "anlu" },
          { label: "汉川市", value: "hanchuan" },
        ],
      },
      {
        label: "仙桃市",
        value: "xiantao",
        children: [
          { label: "沙嘴街道", value: "shazui" },
          { label: "干河街道", value: "ganhe" },
          { label: "龙华山街道", value: "longhuashan" },
          { label: "郑场镇", value: "zhengchang" },
          { label: "剅河镇", value: "daohe" },
          { label: "三伏潭镇", value: "sanfutan" },
          { label: "胡场镇", value: "huchang" },
          { label: "长埫口镇", value: "changtangkou" },
          { label: "沔城镇", value: "miancheng" },
        ],
      },
      {
        label: "潜江市",
        value: "qianjiang",
        children: [
          { label: "园林街道", value: "yuanlin" },
          { label: "杨市街道", value: "yangshi" },
          { label: "周矶街道", value: "zhouji" },
          { label: "广华街道", value: "guanghua" },
          { label: "泰丰街道", value: "taifeng" },
          { label: "高场街道", value: "gaochang" },
          { label: "熊口镇", value: "xiongkou" },
          { label: "老新镇", value: "laoxin" },
          { label: "龙湾镇", value: "longwan2" },
          { label: "渔洋镇", value: "yuyang" },
          { label: "王场镇", value: "wangchang3" },
        ],
      },
      {
        label: "天门市",
        value: "tianmen",
        children: [
          { label: "竟陵街道", value: "jingling" },
          { label: "候口街道", value: "houkou" },
          { label: "杨林街道", value: "yanglin" },
          { label: "小板镇", value: "xiaoban" },
          { label: "岳口镇", value: "yuekou" },
          { label: "皂市镇", value: "zaoshi" },
          { label: "卢市镇", value: "lushi" },
          { label: "麻洋镇", value: "mayang" },
          { label: "多祥镇", value: "duoxiang" },
        ],
      },
      {
        label: "神农架林区",
        value: "shennongjia",
        children: [
          { label: "松柏镇", value: "songbai" },
          { label: "阳日镇", value: "yangri" },
          { label: "木鱼镇", value: "muyu" },
          { label: "红坪镇", value: "hongping" },
          { label: "新华镇", value: "xinhua" },
          { label: "九湖镇", value: "jiuhu" },
          { label: "下谷坪乡", value: "xiaguping" },
        ],
      },
    ],
  },
];

// ============================================================
// filter-panel 联动接口 — 省 → 市 → 区三级模拟数据
// 数据结构：parent 为 'province' 时返回省列表；
//           parent 为省份 value 时返回该省下的市列表；
//           parent 为市 value 时返回该市下的区列表。
// ============================================================

export interface LinkedOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/** 省列表（静态） */
export const linkedProvinces: LinkedOption[] = [
  { label: "广东省", value: "guangdong" },
  { label: "浙江省", value: "zhejiang" },
  { label: "北京市", value: "beijing" },
  { label: "上海市", value: "shanghai" },
];

/** 市数据（key = 省份 value） */
export const linkedCities: Record<string, LinkedOption[]> = {
  guangdong: [
    { label: "广州市", value: "guangzhou" },
    { label: "深圳市", value: "shenzhen" },
    { label: "东莞市", value: "dongguan" },
    { label: "佛山市", value: "foshan" },
  ],
  zhejiang: [
    { label: "杭州市", value: "hangzhou" },
    { label: "宁波市", value: "ningbo" },
    { label: "温州市", value: "wenzhou" },
    { label: "嘉兴市", value: "jiaxing" },
  ],
  beijing: [
    { label: "东城区", value: "dongcheng" },
    { label: "西城区", value: "xicheng" },
    { label: "朝阳区", value: "chaoyang" },
    { label: "海淀区", value: "haidian" },
  ],
  shanghai: [
    { label: "黄浦区", value: "huangpu" },
    { label: "徐汇区", value: "xuhui" },
    { label: "长宁区", value: "changning" },
    { label: "静安区", value: "jingan" },
  ],
};

/** 区数据（key = 市 value） */
export const linkedDistricts: Record<string, LinkedOption[]> = {
  guangzhou: [
    { label: "天河区", value: "tianhe" },
    { label: "越秀区", value: "yuexiu" },
    { label: "白云区", value: "baiyun" },
    { label: "番禺区", value: "panyu" },
  ],
  shenzhen: [
    { label: "福田区", value: "futian" },
    { label: "南山区", value: "nanshan" },
    { label: "宝安区", value: "baoan" },
    { label: "龙岗区", value: "longgang" },
  ],
  dongguan: [
    { label: "莞城街道", value: "guancheng" },
    { label: "东城街道", value: "dongcheng" },
    { label: "南城街道", value: "nancheng" },
    { label: "万江街道", value: "wanjiang" },
  ],
  foshan: [
    { label: "禅城区", value: "shancheng" },
    { label: "南海区", value: "nanhai" },
    { label: "顺德区", value: "shunde" },
  ],
  hangzhou: [
    { label: "西湖区", value: "xihu" },
    { label: "上城区", value: "shangcheng" },
    { label: "拱墅区", value: "gongshu" },
    { label: "滨江区", value: "binjiang" },
  ],
  ningbo: [
    { label: "海曙区", value: "haishu" },
    { label: "江北区", value: "jiangbei" },
    { label: "镇海区", value: "zhenhai" },
  ],
  wenzhou: [
    { label: "鹿城区", value: "lucheng" },
    { label: "龙湾区", value: "longwan" },
    { label: "瓯海区", value: "ouhai" },
  ],
  jiaxing: [
    { label: "南湖区", value: "nanhu" },
    { label: "秀洲区", value: "xiuzhou" },
  ],
  dongcheng: [
    { label: "东城区一", value: "dc1" },
    { label: "东城区二", value: "dc2" },
  ],
  xicheng: [
    { label: "西城区一", value: "xc1" },
    { label: "西城区二", value: "xc2" },
  ],
  chaoyang: [
    { label: "朝阳一", value: "cy1" },
    { label: "朝阳二", value: "cy2" },
  ],
  haidian: [
    { label: "海淀一", value: "hd1" },
    { label: "海淀二", value: "hd2" },
  ],
  huangpu: [
    { label: "黄浦一", value: "hp1" },
    { label: "黄浦二", value: "hp2" },
  ],
  xuhui: [
    { label: "徐汇一", value: "xh1" },
    { label: "徐汇二", value: "xh2" },
  ],
  changning: [
    { label: "长宁一", value: "cn1" },
    { label: "长宁二", value: "cn2" },
  ],
  jingan: [
    { label: "静安一", value: "ja1" },
    { label: "静安二", value: "ja2" },
  ],
};

/**
 * 根据 parent 参数返回对应层级的选项列表。
 * - parent 为空 / 'all'  → 该层级默认全部选项（如：城市返回全部市，区返回全部区）
 * - parent=<省value>       → 该省下的市列表
 * - parent=<市value>       → 该市下的区列表
 * - parent='province'       → 省列表（用于初始加载）
 */
export function getLinkedOptions(parent: string | undefined): LinkedOption[] {
  // 空值或 'all'：返回该层级全部选项（供联动后有默认选项用）
  if (!parent || parent === 'all') {
    // 返回全部市作为默认选项（实际应用中应根据业务逻辑返回对应数据）
    return Object.values(linkedCities).flat()
  }
  // 省份列表
  if (parent === 'province') return linkedProvinces
  // 先查区（末级），再查市
  if (linkedDistricts[parent]) return linkedDistricts[parent]
  if (linkedCities[parent]) return linkedCities[parent]
  return []
}

// ============================================================
// 性别选项
// ============================================================
export const genderOptions: SelectOption[] = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
  { label: "未知", value: "0" },
];

// ============================================================
// 民族列表（56个民族）
// ============================================================
export const ethnicityOptions: SelectOption[] = [
  { label: "汉族", value: "han" },
  { label: "蒙古族", value: "mongol" },
  { label: "回族", value: "hui" },
  { label: "藏族", value: "tibetan" },
  { label: "维吾尔族", value: "uygur" },
  { label: "苗族", value: "miao" },
  { label: "彝族", value: "yi" },
  { label: "壮族", value: "zhuang" },
  { label: "布依族", value: "buyei" },
  { label: "朝鲜族", value: "korean" },
  { label: "满族", value: "manchu" },
  { label: "侗族", value: "dong" },
  { label: "瑶族", value: "yao" },
  { label: "白族", value: "bai" },
  { label: "土家族", value: "tujia" },
  { label: "哈尼族", value: "hani" },
  { label: "哈萨克族", value: "kazak" },
  { label: "傣族", value: "dai" },
  { label: "黎族", value: "li" },
  { label: "傈僳族", value: "lisu" },
  { label: "佤族", value: "wa" },
  { label: "畲族", value: "she" },
  { label: "高山族", value: "gaoshan" },
  { label: "拉祜族", value: "lahu" },
  { label: "水族", value: "shui" },
  { label: "东乡族", value: "dongxiang" },
  { label: "纳西族", value: "naxi" },
  { label: "景颇族", value: "jingpo" },
  { label: "柯尔克孜族", value: "kirgiz" },
  { label: "土族", value: "tu" },
  { label: "达斡尔族", value: "daur" },
  { label: "仫佬族", value: "mulao" },
  { label: "羌族", value: "qiang" },
  { label: "布朗族", value: "blang" },
  { label: "撒拉族", value: "sala" },
  { label: "毛南族", value: "maonan" },
  { label: "仡佬族", value: "gelao" },
  { label: "锡伯族", value: "xibe" },
  { label: "阿昌族", value: "achang" },
  { label: "普米族", value: "pumi" },
  { label: "塔吉克族", value: "tajik" },
  { label: "怒族", value: "nu" },
  { label: "乌孜别克族", value: "uzbek" },
  { label: "俄罗斯族", value: "russian" },
  { label: "鄂温克族", value: "ewenki" },
  { label: "德昂族", value: "deang" },
  { label: "保安族", value: "bonan" },
  { label: "裕固族", value: "yugur" },
  { label: "京族", value: "jing" },
  { label: "塔塔尔族", value: "tatar" },
  { label: "独龙族", value: "dulong" },
  { label: "鄂伦春族", value: "elunchun" },
  { label: "赫哲族", value: "hezong" },
  { label: "门巴族", value: "monba" },
  { label: "珞巴族", value: "loba" },
  { label: "基诺族", value: "jino" },
];

// ============================================================
// 湖北省市区二级联动数据
// ============================================================
export const hubeiProvinces: LinkedOption[] = [
  { label: "湖北省", value: "hubei" },
];

export const hubeiCities: Record<string, LinkedOption[]> = {
  hubei: [
    { label: "武汉市", value: "wuhan" },
    { label: "黄石市", value: "huangshi" },
    { label: "十堰市", value: "shiyan" },
    { label: "宜昌市", value: "yichang" },
    { label: "襄阳市", value: "xiangyang" },
    { label: "鄂州市", value: "ezhou" },
    { label: "荆门市", value: "jingmen" },
    { label: "孝感市", value: "xiaogan" },
    { label: "荆州市", value: "jingzhou" },
    { label: "黄冈市", value: "huanggang" },
    { label: "咸宁市", value: "xianning" },
    { label: "随州市", value: "suizhou" },
    { label: "恩施土家族苗族自治州", value: "enshi" },
    { label: "仙桃市", value: "xiantao" },
    { label: "潜江市", value: "qianjiang" },
    { label: "天门市", value: "tianmen" },
    { label: "神农架林区", value: "shennongjia" },
  ],
};

export const hubeiDistricts: Record<string, LinkedOption[]> = {
  wuhan: [
    { label: "江岸区", value: "jiangan" },
    { label: "江汉区", value: "jianghan" },
    { label: "硚口区", value: "qiaokou" },
    { label: "汉阳区", value: "hanyang" },
    { label: "武昌区", value: "wuchang" },
    { label: "青山区", value: "qingshan" },
    { label: "洪山区", value: "hongshan" },
    { label: "东西湖区", value: "dongxihu" },
    { label: "汉南区", value: "hannan" },
    { label: "蔡甸区", value: "caidian" },
    { label: "江夏区", value: "jiangxia" },
    { label: "黄陂区", value: "huangpi" },
    { label: "新洲区", value: "xinzhou" },
  ],
  huangshi: [
    { label: "黄石港区", value: "huangshigang" },
    { label: "西塞山区", value: "xishaishan" },
    { label: "下陆区", value: "xialu" },
    { label: "铁山区", value: "tieshan" },
    { label: "阳新县", value: "yangxin" },
    { label: "大冶市", value: "daye" },
  ],
  shiyan: [
    { label: "茅箭区", value: "maojian" },
    { label: "张湾区", value: "zhangwan" },
    { label: "郧阳区", value: "yunyang" },
    { label: "郧西县", value: "yunxi" },
    { label: "竹山县", value: "zhushan" },
    { label: "竹溪县", value: "zhuxi" },
    { label: "房县", value: "fangxian" },
    { label: "丹江口市", value: "danjiangkou" },
  ],
  yichang: [
    { label: "西陵区", value: "xiling" },
    { label: "伍家岗区", value: "wujiagang" },
    { label: "点军区", value: "dianjun" },
    { label: "猇亭区", value: "xiaoting" },
    { label: "夷陵区", value: "yiling" },
    { label: "远安县", value: "yuanan" },
    { label: "兴山县", value: "xingshan" },
    { label: "秭归县", value: "zigong" },
    { label: "长阳土家族自治县", value: "changyang" },
    { label: "五峰土家族自治县", value: "wufeng" },
    { label: "宜都市", value: "yidu" },
    { label: "当阳市", value: "dangyang" },
    { label: "枝江市", value: "zhijiang" },
  ],
  xiangyang: [
    { label: "襄城区", value: "xiangcheng" },
    { label: "樊城区", value: "fancheng" },
    { label: "襄州区", value: "xiangzhou" },
    { label: "南漳县", value: "nanzhang" },
    { label: "谷城县", value: "gucheng" },
    { label: "保康县", value: "baokang" },
    { label: "老河口市", value: "laohekou" },
    { label: "枣阳市", value: "zaoyang" },
    { label: "宜城市", value: "yicheng" },
  ],
  ezhou: [
    { label: "梁子湖区", value: "liangzihu" },
    { label: "华容区", value: "huarong" },
    { label: "鄂城区", value: "echeng" },
  ],
  jingmen: [
    { label: "东宝区", value: "dongbao" },
    { label: "掇刀区", value: "duodao" },
    { label: "沙洋县", value: "shayang" },
    { label: "钟祥市", value: "zhongxiang" },
    { label: "京山市", value: "jingshan" },
  ],
  xiaogan: [
    { label: "孝南区", value: "xiaonan" },
    { label: "孝昌县", value: "xiaochang" },
    { label: "大悟县", value: "dawu" },
    { label: "云梦县", value: "yunmeng" },
    { label: "应城市", value: "yingcheng" },
    { label: "安陆市", value: "anlu" },
    { label: "汉川市", value: "hanchuan" },
  ],
  jingzhou: [
    { label: "沙市区", value: "shashi" },
    { label: "荆州区", value: "jingzhouqu" },
    { label: "公安县", value: "gongan" },
    { label: "监利市", value: "jianli" },
    { label: "江陵县", value: "jiangling" },
    { label: "石首市", value: "shishou" },
    { label: "洪湖市", value: "honghu" },
    { label: "松滋市", value: "songzi" },
  ],
  huanggang: [
    { label: "黄州区", value: "huangzhouqu" },
    { label: "团风县", value: "tuofeng" },
    { label: "红安县", value: "hongan" },
    { label: "罗田县", value: "luotian" },
    { label: "英山县", value: "yingshan" },
    { label: "浠水县", value: "xishui" },
    { label: "蕲春县", value: "qichun" },
    { label: "黄梅县", value: "huangmei" },
    { label: "武穴市", value: "wuxue" },
    { label: "麻城市", value: "macheng" },
    { label: "利川市", value: "lichuan" },
  ],
  xianning: [
    { label: "咸安区", value: "xianan" },
    { label: "嘉鱼县", value: "jiayu" },
    { label: "通城县", value: "tongcheng" },
    { label: "崇阳县", value: "chongyang" },
    { label: "通山县", value: "tongshan" },
    { label: "赤壁市", value: "chibi" },
  ],
  suizhou: [
    { label: "曾都区", value: "zengdu" },
    { label: "随县", value: "suixian" },
    { label: "广水市", value: "guangshui" },
  ],
  enshi: [
    { label: "恩施市", value: "enshishi" },
    { label: "利川市", value: "lichuan2" },
    { label: "建始县", value: "jianshi" },
    { label: "巴东县", value: "badong" },
    { label: "宣恩县", value: "xuanen" },
    { label: "咸丰县", value: "xianfeng" },
    { label: "来凤县", value: "laifeng" },
    { label: "鹤峰县", value: "hefeng" },
  ],
  xiantao: [
    { label: "沙嘴街道", value: "shazui" },
    { label: "干河街道", value: "ganhe" },
    { label: "龙华山街道", value: "longhuashan" },
    { label: "郑场镇", value: "zhengchang" },
    { label: "毛嘴镇", value: "maozui" },
    { label: "剅河镇", value: "daohe" },
    { label: "三伏潭镇", value: "sanfutan" },
    { label: "胡场镇", value: "huchang" },
    { label: "长埫口镇", value: "changtangkou" },
    { label: "沔城镇", value: "miancheng" },
    { label: "通海口镇", value: "tonghaikou" },
    { label: "陈场镇", value: "chenchang" },
    { label: "工业园区", value: "gyyq" },
    { label: "沙湖原种场", value: "shylc" },
    { label: "排湖风景区", value: "phfjq" },
  ],
  qianjiang: [
    { label: "园林街道", value: "yuanlin" },
    { label: "杨市街道", value: "yangshi" },
    { label: "周矶街道", value: "zhouji" },
    { label: "广华街道", value: "guanghua" },
    { label: "街道口街道", value: "jiedaokou" },
    { label: "泰丰街道", value: "taifeng" },
    { label: "高场街道", value: "gaochang" },
    { label: "熊口镇", value: "xiongkou" },
    { label: "老新镇", value: "laoxin" },
    { label: "龙湾镇", value: "longwan" },
    { label: "渔洋镇", value: "yuyang" },
    { label: "王场镇", value: "wangchang" },
    { label: "高石碑镇", value: "gaoshibei" },
    { label: "积玉口镇", value: "jiyukou" },
    { label: "浩口镇", value: "haokou" },
    { label: "运粮湖农场", value: "yllc" },
  ],
  tianmen: [
    { label: "竟陵街道", value: "jingling" },
    { label: "候口街道", value: "houkou" },
    { label: "杨林街道", value: "yanglin" },
    { label: "小板镇", value: "xiaoban" },
    { label: "天门工业园", value: "tmgyy" },
    { label: "岳口镇", value: "yuekou" },
    { label: "皂市镇", value: "zaoshi" },
    { label: "卢市镇", value: "lushi" },
    { label: "麻洋镇", value: "mayang" },
    { label: "多祥镇", value: "duoxiang" },
    { label: "彭市镇", value: "pengshi" },
    { label: "横林镇", value: "henglin" },
    { label: "马湾镇", value: "mawan" },
    { label: "干驿镇", value: "ganyiyi" },
    { label: "汪场镇", value: "wangchang2" },
    { label: "蒋场镇", value: "jiangchang" },
    { label: "张港镇", value: "zhanggang" },
    { label: "多宝镇", value: "duobao" },
    { label: "拖市镇", value: "tuoshi" },
    { label: "蒋湖农场", value: "jhhnc" },
    { label: "白茅湖农场", value: "bmhnc" },
  ],
  shennongjia: [
    { label: "松柏镇", value: "songbai" },
    { label: "阳日镇", value: "yangri" },
    { label: "木鱼镇", value: "muyu" },
    { label: "红坪镇", value: "hongping" },
    { label: "新华镇", value: "xinhua" },
    { label: "九湖镇", value: "jiuhu" },
    { label: "下谷坪乡", value: "xiaguping" },
  ],
};

/**
 * 根据 parent 参数返回湖北省市区二级联动选项。
 * - parent 为空 / 'all'  → 返回全部市
 * - parent='province'     → 返回省列表（仅湖北省）
 * - parent=<市value>      → 返回该市下的区/县列表
 */
export function getHubeiLinkedOptions(parent: string | undefined): LinkedOption[] {
  if (!parent || parent === 'all') {
    return Object.values(hubeiCities).flat()
  }
  if (parent === 'province') return hubeiProvinces
  if (hubeiDistricts[parent]) return hubeiDistricts[parent]
  if (hubeiCities[parent]) return hubeiCities[parent]
  return []
}
