import tinytuya
import sys

switches = {
  'switch_2': {
    'device_id': 'bff8da7da6949373e6ivbd',
    'ip': '192.168.178.20',
    'local_key': 'ef9409c25efa2fd6',
  },
  'switch_1': {
    'device_id': 'bf8de7a491ba5116efgtvy',
    'ip': '192.168.178.35',
    'local_key': 'd283a19fc27105f7',
  }
}
id = sys.argv[1]
state = sys.argv[2]

d = tinytuya.OutletDevice(switches[id]['device_id'], switches[id]['ip'], switches[id]['local_key'])
d.set_version(3.4)

if state == 'on':
  d.turn_on()
if state == 'off':
  d.turn_off()
