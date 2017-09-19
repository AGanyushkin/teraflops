import './configuration'; import nconf from 'nconf'
import intel from 'intel'; intel.config(nconf.get('intel'))

import t1 from './test_1'
import t2 from './test_2'
import t3 from './test_3'
import t4 from './test_4'

//t2()
//t3()

//t1()
t4()
