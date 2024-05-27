import numpy as np
import matplotlib.pyplot as plt
import h5py
import sys

# Get first arg
filename = sys.argv[1]

avoid = {
    "metadata",
    "sweepgates_x",
    "sweepgates_y",
    "x_array",
    "y_array"
}

f = h5py.File(filename, 'r')

data_keys = f.keys()
data_keys = sorted(list(set(data_keys)-avoid))

x_axis = f.get("x_array")
y_axis = f.get("y_array")
extent = [
    x_axis[0],x_axis[1],
    y_axis[0],y_axis[1],
]

fig,axs = plt.subplots(len(data_keys),figsize=(4, 10))

for i,data_key in enumerate(data_keys):
    axs[i].imshow(f.get(data_key),aspect="auto",extent=extent,interpolation=None),
    axs[i].set_title(data_key)
fig.tight_layout()

plt.savefig("new.jpeg")
