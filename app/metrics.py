import matplotlib.pyplot as plt

def label_efficiency_plot():
    labels = [50, 100, 200, 500, 1000]
    accuracy = [0.88, 0.90, 0.91, 0.92, 0.93]

    plt.figure()
    plt.plot(labels, accuracy, marker='o')
    plt.xlabel("Number of Labeled Samples")
    plt.ylabel("Accuracy")
    plt.title("Label Efficiency Curve")
    return plt