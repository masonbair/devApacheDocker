#This is the docker image that is the base. We use micromamba as it is a really small version
#of Anaconda which is required for installing all the packages for the application
FROM mambaorg/micromamba

#Some installs require a root user to be assigned
USER root
#Installs apache and its required dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y apache2 libstdc++6 apache2-dev

ENV BASH_ENV ~/.bashrc
SHELL ["/bin/bash", "-c"]

COPY ./environment.yml /home/env/
# Creates the conda environment with the requirements from the environment.yml file
RUN micromamba create -y -f /home/env/environment.yml
# Cleans conda, and removes unnecessary files. Helps make the image a smaller size
RUN micromamba clean --dry-run --all \
    && find /opt/conda/ -follow -type f -name '*.a' -delete \
    && find /opt/conda/ -follow -type f -name '*.pyc' -delete \
    && find /opt/conda/ -follow -type f -name '*.js.map' -delete 

# For some reason these two lines are needed. I was never able to figure out exactly why they are needed
RUN echo "micromamba activate pyimagej" >> ~/.bashrc
ENV PATH /opt/conda/envs/pyimagej/bin/python3:$PATH

# sets the conda environment variable
ENV CONDA_DEFAULT_ENV $(head -1 environment.yml | cut -d' ' -f2)

# Copies all the files
# VERY IMPORTANT: It is recommeneded to copy all teh files as the end, as the files are usually the only thing
# That changes between re-creating images. This helps to cut the container build time by a lot.
COPY ./start_apache.sh .
COPY ./configurations/ /etc/apache2/
COPY ./serverFunctionality/ /var/www/html/flask/
COPY ./serverFunctionality/static/assets/img/fiji-logo.svg /var/www/html/flask/static/fiji-logo/
RUN chmod +x ./start_apache.sh
# Expose port 80
EXPOSE 80
# Change this variable if the application is running on a different server
ENV WEBADDRESS bda.as.kent.edu

# Start Apache when the container starts
CMD ["./start_apache.sh"]