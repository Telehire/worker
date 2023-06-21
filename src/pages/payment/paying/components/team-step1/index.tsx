import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {BillPropsType} from "@/types/biz/bill";

// ** React Imports
import { useEffect, useState } from 'react'
import BillItem from "../bill-item";

interface BillMapValueType{
  currencyType: string;
  currencyTypeName: string;
  currencyTypeNameEn: string;
  price: string;
  billList: BillPropsType[]
}

interface IProps{
  billMap: BillMapValueType[];
  onCancel: any;
  onSure: any;
  exchangeRateMap: {[key: string]: any}
  billInfo: any
}

const TeamStep1 = (props: IProps) => {
  const { billMap, onCancel, onSure, exchangeRateMap, billInfo } = props
  const [checkedList, setCheckedList] = useState<{[key: string | number]: boolean}>({})
  const [fatherCheckedMap, setFatherCheckedMap] = useState<{[key: string | number]: {checked: boolean, price: number | string}}>({
    'CNY': {
      checked: false,
      price: 0,
    },
    'USD': {
      checked: false,
      price: 0
    }
  })
  const [checkedAll, setCheckedAll] = useState<boolean>(false)
  const [totalAmount, setTotalAmount] = useState<number | string>(0)
  useEffect(() => {
    if(billMap.length) {
      const tempArr = billMap.reduce((fin: any, v: BillMapValueType, index: number) => {
        fin.push(...v.billList);
        return fin;
      }, [])
      setCheckedList(tempArr.reduce((fin: any, v: any) => {fin[v.invoiceId] = false; return fin}, {}));
    }
  }, [billMap])

  useEffect(() => {
    const tempFather: any = {};
    let tempTotal: any = 0
    billMap.forEach((fa: any, faIndex) => {
      let checked = true;
      let price: any = 0
      fa.billList.forEach((v: any) => {
        if (!checkedList[v.invoiceId]) {
          checked = false
        } else {

          price += Number(v.invoiceTotalValue / 1000)
        }
      })
      price = price.toFixed(2)
      tempFather[fa.currencyTypeNameEn] = {
        checked,
        price
      }

      if(price && Number(price) !== 0) {
        console.log(price, exchangeRateMap[fa.currencyTypeNameEn])
        tempTotal += exchangeRateMap[fa.currencyTypeNameEn] * Number(price)
      }
    })
    setFatherCheckedMap({
      ...tempFather
    })
    setTotalAmount(tempTotal.toFixed(2))
    setCheckedAll(Object.values(checkedList).every(v => v))

  }, [checkedList])


  const handleCheckChildAll = (index:number, val: boolean) => {
    const tempObj = {...checkedList};
    billMap[index].billList.forEach(v => {
      tempObj[v.invoiceId] = val
    })
    setCheckedList(tempObj)
  }


  const handleChooseBill = () => {
    const checkedBillMap: any = {};
    billMap.forEach((fa) => {
      fa.billList.forEach(v => {
        if(checkedList[v.invoiceId]) {
          if(!checkedBillMap[fa.currencyTypeNameEn]) {
            checkedBillMap[fa.currencyTypeNameEn] = {...fa, money: 0, exchangeRate: exchangeRateMap[fa.currencyTypeNameEn]}
          }
          checkedBillMap[fa.currencyTypeNameEn].money += Number(v.invoiceTotalValue)
          checkedBillMap[fa.currencyTypeNameEn].exchangeRate = exchangeRateMap[fa.currencyTypeNameEn]
        }
      })
    })
    console.log(checkedBillMap)
    onSure(Object.values(checkedBillMap))
  }

  const handleCheckAll = (val: boolean) => {
    setCheckedList(Object.keys(checkedList).reduce((fin: any, v: string) => {fin[v] = val; return fin}, {}))
    setFatherCheckedMap({...Object.keys(fatherCheckedMap).reduce((fin: any, v: any) => { fin[v] = val;return fin }, {})})
  }

  const childHandleChangeCheck = (id: number | string, val: boolean, faIndex: number) => {
    setCheckedList({...checkedList, [id]: val});
  }

  return (
    <Grid container md={12} sx={{backgroundColor: '#fff', borderRadius: '8px',display: 'flex', padding: '20px',flexDirection: 'row'}}>
      <Typography sx={{fontSize: 14, fontWeight: 500,mb: 3}}>选择要支付的账单</Typography>
      <Grid container xs={12} sx={{backgroundColor: '#F2F6FC',borderRadius: '8px', display: 'flex', alignItems: 'center', height: '64px'}}>
        <Checkbox checked={checkedAll} onChange={(e, val) => handleCheckAll(val)} />
        <Grid item sx={{display: 'flex', flex: 1}}>
          <Grid item>
            <Typography sx={{fontSize: 14, fontWeight: 500}}>总金额</Typography>
            <Typography sx={{color: '#909399', fontSize: 12}}>{`${Object.values(checkedList).filter(v => v).length}/${(Object.values(checkedList)).length}账单被选中`}</Typography>
          </Grid>
        </Grid>
        <Typography sx={{fontSize: 24, fontWeight: 500,pr: 2, color :'#3A3541'}}>{`${billInfo.businessEntityCurrencyIcon} ${totalAmount}`}</Typography>
      </Grid>
      {
        billMap.filter(v => v.billList.length !== 0).map((fa, faIndex) => (
          <Grid key={fa.currencyTypeName} container xs={12} sx={{backgroundColor: '#fff'}}>
            <Grid item xs={12} sx={{display: 'flex', alignItems: 'center'}}>
              <Checkbox checked={fatherCheckedMap[fa.currencyTypeNameEn]?.checked || false} onChange={(e, val) => handleCheckChildAll(faIndex, val)} />
              <Grid item sx={{display: 'flex', flex: 1}}>
                <Typography sx={{fontSize: 14, fontWeight: 500, flex: 1}}>{`${fa.currencyTypeName} - ${fa.currencyTypeNameEn}`}</Typography>
                <Grid sx={{display: 'flex',alignItems: 'center'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500}}>小结：</Typography>
                  <Typography sx={{fontSize: 16, fontWeight: 500,color: '#7C4DFF'}}>{`${fa.currencyType} ${fatherCheckedMap[fa.currencyTypeNameEn]?.price}`}</Typography>
                </Grid>
              </Grid>
            </Grid>
            {
              fa.billList.map((item, index) => (
                <BillItem {...item} key={index} checked={checkedList[item.invoiceId]} handleChange={childHandleChangeCheck} faIndex={faIndex} currency={fa.currencyType} />
              ))
            }
          </Grid>
        ))
      }
      <Grid container xs={12} sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
        <Button variant="text" onClick={() => {onCancel()}} sx={{border: '1px solid #8A8D9380', borderRadius: '5px',color: '#8A8D93', width: 73, height: 38,mr: 2}}>取消</Button>
        <Button disabled={!Object.values(checkedList).some(v => v)} variant="contained" onClick={() => {handleChooseBill()}} sx={{width: 73, height: 38}}>继续</Button>
      </Grid>
    </Grid>
  )
}
export default TeamStep1
