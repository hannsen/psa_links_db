import tinytuya
import sys

switches = {
  'switch_1': {
    'ip': '192.168.178.35',
    'device_id': 'bf8de7a491ba5116efgtvy',
    'local_key': 'd283a19fc27105f7',
    'type': 'switch',
  },
  'switch_2': {
    'ip': '192.168.178.20',
    'device_id': 'bff8da7da6949373e6ivbd',
    'local_key': 'ef9409c25efa2fd6',
    'type': 'switch',
  },
  'lamp_1': {
    'ip': '192.168.178.37',
    'device_id': 'bf8e4bf6bcfde8de79me5s',
    'local_key': '06a50b5e35d0b06b',
    'type': 'lamp',
  }
}
id = sys.argv[1]
state = sys.argv[2]

if switches[id]['type'] == 'lamp':
  d = tinytuya.BulbDevice(switches[id]['device_id'], switches[id]['ip'], switches[id]['local_key'])
else:
  d = tinytuya.OutletDevice(switches[id]['device_id'], switches[id]['ip'], switches[id]['local_key'])

d.set_version(3.4)

if state == 'on':
  d.turn_on()
if state == 'off':
  d.turn_off()
